#!/usr/bin/env node

/**
 * Storybook to llms.txt Generator
 * 
 * This script generates an llms.txt file and component documentation
 * from Storybook stories.tsx files in your project.
 * 
 * Usage: node generate-llms-txt.js
 * 
 * Dependencies:
 * npm install ts-morph mdast-builder mdast-util-to-markdown mdast-util-gfm-table mdast-util-gfm
 */

import { Project, SyntaxKind, Node, TypeFormatFlags } from 'ts-morph';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { root, heading, paragraph, text, code, blockquote, link, list, listItem, html } from 'mdast-builder';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { gfmToMarkdown } from 'mdast-util-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LLMSGenerator {
  constructor(projectRoot = process.cwd(), outputDir = '.storybook/public') {
    this.projectRoot = projectRoot;
    this.outputDir = outputDir;
    this.project = new Project({
      tsConfigFilePath: path.join(projectRoot, 'tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
      skipFileDependencyResolution: true
    });
    this.components = new Map();
  }

  /**
   * Main execution function
   */
  async generate() {
    console.log('🔍 Scanning for Storybook stories in src/components...');
    
    const componentsDir = path.join(this.projectRoot, 'src', 'components');
    
    if (!fs.existsSync(componentsDir)) {
      console.error(`❌ src/components directory not found at: ${componentsDir}`);
      process.exit(1);
    }
    
    const storyFiles = this.findStoryFiles(componentsDir);
    console.log(`📚 Found ${storyFiles.length} story files\n`);

    for (const storyFile of storyFiles) {
      await this.processStoryFile(storyFile);
    }

    console.log(`\n✅ Processed ${this.components.size} components`);
    
    await this.generateMarkdownFiles();
    await this.generateLLMSTxt();

    console.log('\n🎉 Done! llms.txt generated successfully');
  }

  /**
   * Recursively find all stories.tsx files
   */
  findStoryFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        this.findStoryFiles(fullPath, files);
        continue;
      }
      
      if (entry.isFile() && entry.name.match(/\.stories\.tsx?$/)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Process a single story file
   */
  async processStoryFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`📖 ${fileName}`);
    
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    const metaTitle = this.extractMetaTitle(sourceFile);
    if (!metaTitle) {
      console.warn(`   ⚠️  No meta.title found`);
      return;
    }

    const [category, componentName] = this.parseMetaTitle(metaTitle);

    const componentPath = this.findComponentFile(filePath);
    if (!componentPath) {
      console.warn(`   ⚠️  No index.tsx found`);
      return;
    }

    const propsTypeName = this.extractPropsTypeFromMeta(sourceFile);
    const componentSourceFile = this.project.addSourceFileAtPath(componentPath);
    
    const storyJsDoc = this.extractStoryJsDoc(sourceFile);
    const props = this.extractProps(componentSourceFile, componentName, propsTypeName);
    const stories = this.extractStories(sourceFile, componentName);
    const componentJsDoc = this.extractComponentJsDoc(componentSourceFile, componentName);

    console.log(`   ✓ ${props.length} props, ${stories.length} stories`);

    this.components.set(componentName.toLowerCase(), {
      name: componentName,
      category: category.toLowerCase(),
      filePath,
      componentPath,
      props,
      stories,
      jsDoc: componentJsDoc,
      storyJsDoc
    });
  }

  /**
   * Extract the props type name from meta satisfies expression
   */
  extractPropsTypeFromMeta(sourceFile) {
    const metaVar = sourceFile.getVariableDeclaration('meta');
    if (!metaVar) return null;

    const initializer = metaVar.getInitializer();
    if (!initializer) return null;
    if (initializer.getKind() !== SyntaxKind.SatisfiesExpression) return null;

    const typeText = initializer.getType().getText();
    const match = typeText.match(/Meta<(.+?)>/);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract meta.title from the story file
   */
  extractMetaTitle(sourceFile) {
    const metaVar = sourceFile.getVariableDeclaration('meta');
    if (metaVar) {
      const initializer = metaVar.getInitializer();
      if (initializer) {
        const title = this.getTitleFromObject(initializer);
        if (title) return title;
      }
    }

    const defaultExport = sourceFile.getDefaultExportSymbol();
    if (!defaultExport) return null;

    const declarations = defaultExport.getDeclarations();
    for (const decl of declarations) {
      if (decl.getKind() === SyntaxKind.VariableDeclaration) {
        const initializer = decl.getInitializer();
        if (initializer) {
          const title = this.getTitleFromObject(initializer);
          if (title) return title;
        }
      }
      
      if (decl.getKind() === SyntaxKind.ExportAssignment) {
        const expression = decl.getExpression();
        if (expression) {
          const title = this.getTitleFromObject(expression);
          if (title) return title;
        }
      }
    }

    return null;
  }

  /**
   * Extract title property from an object expression
   */
  getTitleFromObject(node) {
    if (node.getKind() === SyntaxKind.ObjectLiteralExpression) {
      const titleProp = node.getProperty('title');
      if (!titleProp) return null;
      if (titleProp.getKind() !== SyntaxKind.PropertyAssignment) return null;

      const value = titleProp.getInitializer();
      if (!value) return null;
      if (value.getKind() !== SyntaxKind.StringLiteral) return null;

      return value.getLiteralText();
    }
    
    if (node.getKind() === SyntaxKind.AsExpression || 
        node.getKind() === SyntaxKind.SatisfiesExpression) {
      return this.getTitleFromObject(node.getExpression());
    }

    if (node.getKind() === SyntaxKind.Identifier) {
      const symbol = node.getSymbol();
      if (!symbol) return null;

      const declarations = symbol.getDeclarations();
      for (const decl of declarations) {
        if (decl.getKind() !== SyntaxKind.VariableDeclaration) continue;

        const initializer = decl.getInitializer();
        if (!initializer) continue;

        return this.getTitleFromObject(initializer);
      }
    }

    return null;
  }

  /**
   * Parse meta.title into category and component name
   */
  parseMetaTitle(metaTitle) {
    const parts = metaTitle.split('/');
    const category = parts.slice(0, -1).join('/') || 'Components';
    const componentName = parts[parts.length - 1];
    return [category, componentName];
  }

  /**
   * Find the component's index.tsx file
   */
  findComponentFile(storyFilePath) {
    const dir = path.dirname(storyFilePath);
    const possibleFiles = ['index.tsx', 'index.ts'];

    for (const file of possibleFiles) {
      const componentPath = path.join(dir, file);
      if (fs.existsSync(componentPath)) {
        return componentPath;
      }
    }

    return null;
  }

  /**
   * Extract props from component
   */
  extractProps(sourceFile, componentName, propsTypeName = null) {
    const props = [];
    const typeName = propsTypeName || `${componentName}Props`;
    const propsType = sourceFile.getTypeAlias(typeName) || sourceFile.getInterface(typeName);
    
    if (!propsType) return props;

    if (Node.isTypeAliasDeclaration(propsType)) {
      this.extractPropsFromTypeAlias(propsType, props);
    } else {
      this.extractPropsFromInterface(propsType, props);
    }

    return props;
  }

  /**
   * Extract props from a type alias
   */
  extractPropsFromTypeAlias(typeAlias, props) {
    const typeNode = typeAlias.getTypeNode();
    if (!typeNode) return;

    if (Node.isIntersectionTypeNode(typeNode)) {
      typeNode.getTypeNodes().forEach(type => this.extractPropsFromTypeNode(type, props));
      return;
    }
    
    if (Node.isUnionTypeNode(typeNode)) {
      typeNode.getTypeNodes().forEach(type => this.extractPropsFromTypeNode(type, props));
      return;
    }
    
    this.extractPropsFromTypeNode(typeNode, props);
  }

  /**
   * Extract props from a type node
   */
  extractPropsFromTypeNode(typeNode, props) {
    if (Node.isTypeReference(typeNode)) {
      this.extractPropsFromTypeReference(typeNode, props);
      return;
    }
    
    if (Node.isTypeLiteral(typeNode)) {
      typeNode.getMembers().forEach(member => {
        if (Node.isPropertySignature(member)) {
          this.extractPropFromPropertySignature(member, props);
        }
      });
      return;
    }
    
    if (Node.isIntersectionTypeNode(typeNode)) {
      typeNode.getTypeNodes().forEach(type => this.extractPropsFromTypeNode(type, props));
    }
  }

  /**
   * Extract props from a type reference
   */
  extractPropsFromTypeReference(typeNode, props) {
    const typeName = typeNode.getTypeName().getText();
    
    if (this.shouldSkipType(typeName)) return;

    const symbol = typeNode.getTypeName().getSymbol();
    if (!symbol) return;

    symbol.getDeclarations().forEach(decl => {
      if (Node.isTypeAliasDeclaration(decl)) {
        const aliasTypeNode = decl.getTypeNode();
        if (aliasTypeNode) {
          this.extractPropsFromTypeNode(aliasTypeNode, props);
        }
        return;
      }
      
      if (Node.isInterfaceDeclaration(decl)) {
        decl.getProperties().forEach(prop => {
          this.extractPropFromPropertySignature(prop, props);
        });
        return;
      }
      
      if (Node.isImportSpecifier(decl)) {
        const aliasedSymbol = symbol.getAliasedSymbol();
        if (!aliasedSymbol) return;

        aliasedSymbol.getDeclarations().forEach(aliasedDecl => {
          if (Node.isTypeAliasDeclaration(aliasedDecl)) {
            const aliasTypeNode = aliasedDecl.getTypeNode();
            if (aliasTypeNode) {
              this.extractPropsFromTypeNode(aliasTypeNode, props);
            }
            return;
          }
          
          if (Node.isInterfaceDeclaration(aliasedDecl)) {
            aliasedDecl.getProperties().forEach(prop => {
              this.extractPropFromPropertySignature(prop, props);
            });
          }
        });
      }
    });
  }

  /**
   * Determine if a type should be skipped
   */
  shouldSkipType(typeName) {
    const skipTypes = [
      'ButtonHTMLAttributes', 'AnchorHTMLAttributes', 'HTMLAttributes', 'DOMAttributes',
      'AriaAttributes', 'InputHTMLAttributes', 'TextareaHTMLAttributes',
      'SelectHTMLAttributes', 'FormHTMLAttributes', 'ImgHTMLAttributes',
      'LabelHTMLAttributes', 'OptionHTMLAttributes'
    ];
    return skipTypes.includes(typeName);
  }

  /**
   * Extract a single prop from a property signature
   */
  extractPropFromPropertySignature(member, props) {
    const propName = member.getName();
    if (props.some(p => p.name === propName)) return;

    const propType = member.getType();
    const typeText = propType.getText(undefined, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
    const required = !member.hasQuestionToken();
    
    const description = this.extractJsDoc(member);

    props.push({
      name: propName,
      type: this.simplifyType(typeText),
      required,
      description
    });
  }

  /**
   * Extract props from an interface
   */
  extractPropsFromInterface(interfaceDecl, props) {
    interfaceDecl.getProperties().forEach(prop => {
      this.extractPropFromPropertySignature(prop, props);
    });

    interfaceDecl.getExtends().forEach(ext => {
      const extType = ext.getExpression().getType();
      extType.getProperties().forEach(prop => {
        const declarations = prop.getDeclarations();
        if (declarations.length === 0) return;
        if (!Node.isPropertySignature(declarations[0])) return;

        this.extractPropFromPropertySignature(declarations[0], props);
      });
    });
  }

  /**
   * Simplify type text for readability
   */
  simplifyType(typeText) {
    typeText = typeText.replace(/import\([^)]+\)\./g, '');
    typeText = typeText.replace(/React\.ReactNode/g, 'ReactNode');
    typeText = typeText.replace(/React\.ReactElement/g, 'ReactElement');
    
    if (typeText.length > 150) {
      const unionParts = typeText.split('|');
      if (unionParts.length > 3) {
        return unionParts.slice(0, 3).join(' | ') + ' | ...';
      }
    }
    
    return typeText;
  }

  /**
   * Extract stories from the story file
   */
  extractStories(sourceFile, componentName) {
    const stories = [];
    const statements = sourceFile.getStatements();
    
    for (const statement of statements) {
      if (!Node.isVariableStatement(statement)) continue;
      if (!statement.isExported()) continue;

      const declarations = statement.getDeclarations();
      
      for (const decl of declarations) {
        const name = decl.getName();
        if (name === 'meta' || name === 'default') continue;
        
        const type = decl.getType().getText();
        if (!type.includes('Story')) continue;

        const initializer = decl.getInitializer();
        if (!initializer) continue;

        const jsDoc = this.extractJsDoc(statement);
        const jsxCode = this.convertStoryToJSX(initializer, componentName);

        stories.push({ name, code: jsxCode, jsDoc });
      }
    }

    return stories;
  }

  /**
   * Extract JSDoc from a node
   */
  extractJsDoc(node) {
    if (!node) return undefined;

    try {
      if (typeof node.getJsDocs !== 'function') return undefined;

      const jsDocs = node.getJsDocs();
      if (!jsDocs || jsDocs.length === 0) return undefined;

      const comment = jsDocs[0].getComment();
      
      if (typeof comment === 'string') return comment;
      
      if (Array.isArray(comment)) {
        return comment.map(part => {
          if (typeof part === 'string') return part;
          if (part && typeof part.text === 'string') return part.text;
          return '';
        }).join('');
      }
    } catch (error) {
      return undefined;
    }
    
    return undefined;
  }

  /**
   * Extract JSDoc from component
   */
  extractComponentJsDoc(sourceFile, componentName) {
    const functionDecl = sourceFile.getFunction(componentName);
    const variableDecl = sourceFile.getVariableDeclaration(componentName);
    return this.extractJsDoc(functionDecl || variableDecl);
  }

  /**
   * Extract JSDoc from story file meta
   */
  extractStoryJsDoc(sourceFile) {
    const statements = sourceFile.getStatements();
    
    for (const statement of statements) {
      if (!Node.isVariableStatement(statement)) continue;

      const declarations = statement.getDeclarations();
      for (const decl of declarations) {
        if (decl.getName() === 'meta') {
          return this.extractJsDoc(statement);
        }
      }
    }
    
    return undefined;
  }

  /**
   * Convert a Storybook story object to JSX code
   */
  convertStoryToJSX(initializer, componentName) {
    if (initializer.getKind() !== SyntaxKind.ObjectLiteralExpression) {
      return `<${componentName} />`;
    }

    const renderProp = initializer.getProperty('render');
    if (renderProp && renderProp.getKind() === SyntaxKind.PropertyAssignment) {
      return this.extractJSXFromRender(renderProp.getInitializer());
    }

    const argsProp = initializer.getProperty('args');
    if (argsProp && argsProp.getKind() === SyntaxKind.PropertyAssignment) {
      return this.constructJSXFromArgs(componentName, argsProp.getInitializer());
    }

    return `<${componentName} />`;
  }

  /**
   * Extract JSX from a render function
   */
  extractJSXFromRender(renderFunc) {
    if (!renderFunc) return '';

    const body = renderFunc.getBody();
    if (!body) return '';

    if (Node.isBlock(body)) {
      const returnStatement = body.getStatements().find(stmt => Node.isReturnStatement(stmt));
      if (!returnStatement) return '';

      const expression = returnStatement.getExpression();
      if (!expression) return '';

      return this.formatJSX(expression.getText());
    }

    return this.formatJSX(body.getText());
  }

  /**
   * Construct JSX from args object
   */
  constructJSXFromArgs(componentName, argsObj) {
    if (!argsObj || argsObj.getKind() !== SyntaxKind.ObjectLiteralExpression) {
      return `<${componentName} />`;
    }

    const properties = argsObj.getProperties();
    const props = [];
    let children = null;

    for (const prop of properties) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propName = prop.getName();
      const initializer = prop.getInitializer();
      if (!initializer) continue;

      if (propName === 'children') {
        children = this.getValueString(initializer);
      } else {
        const value = this.getValueString(initializer);
        props.push(this.formatProp(propName, value, initializer.getKind()));
      }
    }

    const propsString = props.length > 0 ? ' ' + props.join(' ') : '';
    
    if (children) {
      return `<${componentName}${propsString}>\n  ${children}\n</${componentName}>`;
    }
    
    return `<${componentName}${propsString} />`;
  }

  /**
   * Get value as string from an initializer
   */
  getValueString(initializer) {
    const kind = initializer.getKind();
    
    if (kind === SyntaxKind.StringLiteral) {
      return initializer.getLiteralText();
    }
    
    if (kind === SyntaxKind.TrueKeyword || kind === SyntaxKind.FalseKeyword) {
      return initializer.getText();
    }
    
    if (kind === SyntaxKind.NumericLiteral) {
      return initializer.getLiteralText();
    }

    return initializer.getText();
  }

  /**
   * Format a prop for JSX output
   */
  formatProp(propName, value, kind) {
    if (value === 'true') return propName;
    if (kind === SyntaxKind.StringLiteral) return `${propName}="${value}"`;
    return `${propName}={${value}}`;
  }

  /**
   * Format JSX code
   */
  formatJSX(code) {
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  /**
   * Generate markdown files for each component
   */
  async generateMarkdownFiles() {
    console.log('\n📝 Generating markdown files...');

    for (const [, component] of this.components) {
      const categoryDir = path.join(this.outputDir, component.category);
      const mdFilePath = path.join(categoryDir, `${component.name.toLowerCase()}.md`);

      fs.mkdirSync(categoryDir, { recursive: true });

      const mdContent = this.buildComponentMarkdown(component);
      fs.writeFileSync(mdFilePath, mdContent, 'utf-8');
      
      console.log(`   ✓ ${path.relative(this.outputDir, mdFilePath)}`);
    }
  }

  /**
   * Build markdown content using mdast
   */
  buildComponentMarkdown(component) {
    const content = [];

    // Title
    content.push(heading(1, text(component.name)));

    // Description - use raw HTML to preserve markdown
    const description = component.storyJsDoc || component.jsDoc;
    if (description) {
      content.push({
        type: 'paragraph',
        children: [{
          type: 'html',
          value: description
        }]
      });
    }

    // Props table
    if (component.props.length > 0) {
      content.push(heading(2, text('Props')));
      content.push(this.buildPropsTable(component.props));
    }

    // Examples
    if (component.stories.length > 0) {
      content.push(heading(2, text('Examples')));
      
      for (const story of component.stories) {
        content.push(heading(3, text(story.name)));
        
        if (story.jsDoc) {
          content.push({
            type: 'paragraph',
            children: [html(story.jsDoc)]
          });
        }
        
        content.push(code('jsx', story.code));
      }
    }

    const tree = root(content);
    return toMarkdown(tree, { extensions: [gfmToMarkdown()] });
  }

  /**
   * Build a GFM table for props
   */
  buildPropsTable(props) {
    return {
      type: 'table',
      align: ['left', 'left', 'center', 'left'],
      children: [
        // Header row
        {
          type: 'tableRow',
          children: [
            { type: 'tableCell', children: [text('Prop')] },
            { type: 'tableCell', children: [text('Type')] },
            { type: 'tableCell', children: [text('Required')] },
            { type: 'tableCell', children: [text('Description')] }
          ]
        },
        // Data rows
        ...props.map(prop => ({
          type: 'tableRow',
          children: [
            { type: 'tableCell', children: [text(prop.name)] },
            { type: 'tableCell', children: [{ type: 'inlineCode', value: prop.type }] },
            { type: 'tableCell', children: [text(prop.required ? 'Yes' : 'No')] },
            { type: 'tableCell', children: [text(prop.description || '')] }
          ]
        }))
      ]
    };
  }

  /**
   * Generate the main llms.txt file
   */
  async generateLLMSTxt() {
    console.log('\n📄 Generating llms.txt...');

    const content = [];
    const projectName = this.getProjectName();
    
    // Title
    content.push(heading(1, text(projectName)));
    
    // Summary blockquote
    content.push(
      blockquote(
        paragraph(
          text(`Component documentation for ${projectName}. This documentation is auto-generated from Storybook stories and provides comprehensive information about all available components, their props, and usage examples.`)
        )
      )
    );

    // Components by category
    const categorizedComponents = this.categorizeComponents();

    for (const [category, components] of categorizedComponents) {
      const categoryTitle = this.capitalizeWords(category.replace(/\//g, ' / '));
      content.push(heading(2, text(categoryTitle)));

      const items = components.map(component => {
        const componentPath = `https://system.damato.design/${component.category}/${component.name.toLowerCase()}.md`;
        const description = component.storyJsDoc || component.jsDoc 
          ? this.truncateDescription(component.storyJsDoc || component.jsDoc)
          : `${component.name} component with ${component.props.length} props and ${component.stories.length} examples`;
        
        // Create a single paragraph node with link and text as phrasing content
        return listItem(
          paragraph([
            link(componentPath, undefined, text(component.name)),
            html(`: ${description}`)
          ])
        );
      });

      content.push(list('unordered', items));
    }

    const tree = root(content);
    const markdown = toMarkdown(tree);

    const llmsTxtPath = path.join(this.outputDir, 'llms.txt');
    fs.writeFileSync(llmsTxtPath, markdown, 'utf-8');

    console.log(`   ✓ llms.txt`);
  }

  /**
   * Truncate description
   */
  truncateDescription(description) {
    description = description.replace(/\s+/g, ' ').trim();
    const firstSentence = description.split(/[.!?]\s/)[0];
    
    if (firstSentence.length <= 150) return firstSentence;
    return description.substring(0, 147) + '...';
  }

  /**
   * Get project name from package.json
   */
  getProjectName() {
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.name || 'Component Library';
    } catch {
      return 'Component Library';
    }
  }

  /**
   * Categorize components by category
   */
  categorizeComponents() {
    const categorized = new Map();

    for (const [, component] of this.components) {
      const category = component.category;
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category).push(component);
    }

    for (const [, components] of categorized) {
      components.sort((a, b) => a.name.localeCompare(b.name));
    }

    return categorized;
  }

  /**
   * Capitalize words in a string
   */
  capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

// CLI execution
const generator = new LLMSGenerator();
generator.generate().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

export default LLMSGenerator;