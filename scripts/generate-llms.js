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
 * npm install ts-morph mdast-builder mdast-util-to-markdown
 */

import { Project, SyntaxKind, Node, TypeFormatFlags } from 'ts-morph';
import fs from 'fs';
import path from 'path';
import { heading, text, paragraph, list, listItem, code, blockquote, link, root } from 'mdast-builder';
import { toMarkdown } from 'mdast-util-to-markdown';
import { fileURLToPath } from 'url';

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
    console.log(`📚 Found ${storyFiles.length} story files`);

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
      } else if (entry.isFile() && entry.name.match(/\.stories\.tsx?$/)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Process a single story file
   */
  async processStoryFile(filePath) {
    console.log(`\n📖 Processing: ${filePath}`);
    
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    const metaTitle = this.extractMetaTitle(sourceFile);
    if (!metaTitle) {
      console.warn(`⚠️  No meta.title found in ${filePath}`);
      return;
    }

    const [category, componentName] = this.parseMetaTitle(metaTitle);
    console.log(`   Component: ${componentName} (${category})`);

    const componentPath = this.findComponentFile(filePath);
    if (!componentPath) {
      console.warn(`⚠️  Could not find component file for ${componentName}`);
      return;
    }

    const componentSourceFile = this.project.addSourceFileAtPath(componentPath);
    
    // Extract JSDoc from the story file meta (not component)
    const storyJsDoc = this.extractStoryJsDoc(sourceFile);
    
    // Extract props from the component's exported type
    const props = this.extractProps(componentSourceFile, componentName);
    const stories = this.extractStories(sourceFile, componentName);
    const componentJsDoc = this.extractComponentJsDoc(componentSourceFile, componentName);

    this.components.set(componentName.toLowerCase(), {
      name: componentName,
      category: category.toLowerCase(),
      filePath,
      componentPath,
      props,
      stories,
      jsDoc: componentJsDoc,
      storyJsDoc // JSDoc from the story file
    });
  }

  /**
   * Extract meta.title from the story file using ts-morph
   */
  extractMetaTitle(sourceFile) {
    // Look for 'meta' variable first (most common)
    const metaVar = sourceFile.getVariableDeclaration('meta');
    if (metaVar) {
      const initializer = metaVar.getInitializer();
      if (initializer) {
        const title = this.getTitleFromObject(initializer);
        if (title) return title;
      }
    }

    // Look for default export
    const defaultExport = sourceFile.getDefaultExportSymbol();
    if (defaultExport) {
      const declarations = defaultExport.getDeclarations();
      for (const decl of declarations) {
        if (decl.getKind() === SyntaxKind.VariableDeclaration) {
          const initializer = decl.getInitializer();
          if (initializer) {
            const title = this.getTitleFromObject(initializer);
            if (title) return title;
          }
        } else if (decl.getKind() === SyntaxKind.ExportAssignment) {
          const expression = decl.getExpression();
          if (expression) {
            const title = this.getTitleFromObject(expression);
            if (title) return title;
          }
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
      if (titleProp && titleProp.getKind() === SyntaxKind.PropertyAssignment) {
        const value = titleProp.getInitializer();
        if (value && value.getKind() === SyntaxKind.StringLiteral) {
          return value.getLiteralText();
        }
      }
    }
    
    // Handle `as const` or `satisfies` expressions
    if (node.getKind() === SyntaxKind.AsExpression || 
        node.getKind() === SyntaxKind.SatisfiesExpression) {
      const expression = node.getExpression();
      if (expression) {
        return this.getTitleFromObject(expression);
      }
    }

    // Handle identifier references
    if (node.getKind() === SyntaxKind.Identifier) {
      const symbol = node.getSymbol();
      if (symbol) {
        const declarations = symbol.getDeclarations();
        for (const decl of declarations) {
          if (decl.getKind() === SyntaxKind.VariableDeclaration) {
            const initializer = decl.getInitializer();
            if (initializer) {
              return this.getTitleFromObject(initializer);
            }
          }
        }
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
   * Extract props from component using ts-morph
   */
  extractProps(sourceFile, componentName) {
    const props = [];
    const propsTypeName = `${componentName}Props`;

    console.log(`   Looking for type: ${propsTypeName}`);

    // Try to find the type alias (most common pattern)
    const propsType = sourceFile.getTypeAlias(propsTypeName);
    
    if (propsType) {
      console.log(`   Found type alias: ${propsTypeName}`);
      this.extractPropsFromTypeAlias(propsType, props);
      console.log(`   Extracted ${props.length} props from type alias`);
      return props;
    }

    // Fallback to interface
    const propsInterface = sourceFile.getInterface(propsTypeName);
    if (propsInterface) {
      console.log(`   Found interface: ${propsTypeName}`);
      this.extractPropsFromInterface(propsInterface, props);
      console.log(`   Extracted ${props.length} props from interface`);
    } else {
      console.log(`   ⚠️  No ${propsTypeName} type or interface found`);
    }

    return props;
  }

  /**
   * Extract props from a type alias (handles union types and intersections)
   */
  extractPropsFromTypeAlias(typeAlias, props) {
    const typeNode = typeAlias.getTypeNode();
    
    if (!typeNode) return;

    // Handle intersection types (A & B & C)
    if (Node.isIntersectionTypeNode(typeNode)) {
      const types = typeNode.getTypeNodes();
      
      for (const type of types) {
        this.extractPropsFromTypeNode(type, props);
      }
    } 
    // Handle union types (A | B)
    else if (Node.isUnionTypeNode(typeNode)) {
      const types = typeNode.getTypeNodes();
      
      // For union types, extract from all branches
      for (const type of types) {
        this.extractPropsFromTypeNode(type, props);
      }
    }
    // Handle direct type reference
    else {
      this.extractPropsFromTypeNode(typeNode, props);
    }
  }

  /**
   * Extract props from a type node
   */
  extractPropsFromTypeNode(typeNode, props) {
    // Handle type references (e.g., BoxProps, ButtonHTMLAttributes)
    if (Node.isTypeReference(typeNode)) {
      const typeName = typeNode.getTypeName().getText();
      
      // Skip HTML attributes and common React types to avoid clutter
      if (this.shouldSkipType(typeName)) {
        return;
      }

      // Try to resolve the type
      const type = typeNode.getType();
      this.extractPropsFromType(type, props);
    }
    // Handle object literal types
    else if (Node.isTypeLiteral(typeNode)) {
      const members = typeNode.getMembers();
      
      for (const member of members) {
        if (Node.isPropertySignature(member)) {
          this.extractPropFromPropertySignature(member, props);
        }
      }
    }
  }

  /**
   * Determine if a type should be skipped (React/HTML types)
   */
  shouldSkipType(typeName) {
    const skipTypes = [
      'ButtonHTMLAttributes',
      'AnchorHTMLAttributes',
      'HTMLAttributes',
      'DOMAttributes',
      'AriaAttributes',
      'InputHTMLAttributes',
      'TextareaHTMLAttributes',
      'SelectHTMLAttributes',
      'FormHTMLAttributes'
    ];
    
    return skipTypes.some(skip => typeName.includes(skip));
  }

  /**
   * Extract props from a resolved Type
   */
  extractPropsFromType(type, props) {
    const properties = type.getProperties();

    for (const prop of properties) {
      const name = prop.getName();
      
      // Skip if we already have this prop
      if (props.some(p => p.name === name)) continue;

      const declarations = prop.getDeclarations();
      
      if (declarations.length > 0) {
        const decl = declarations[0];
        
        if (Node.isPropertySignature(decl)) {
          this.extractPropFromPropertySignature(decl, props);
        }
      }
    }
  }

  /**
   * Extract a single prop from a property signature
   */
  extractPropFromPropertySignature(member, props) {
    const propName = member.getName();
    
    // Skip if already exists
    if (props.some(p => p.name === propName)) return;

    const propType = member.getType();
    const typeText = propType.getText(undefined, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
    const required = !member.hasQuestionToken();
    
    // Extract JSDoc
    let description = undefined;
    
    try {
      if (typeof member.getJsDocs === 'function') {
        const jsDocs = member.getJsDocs();
        if (jsDocs && jsDocs.length > 0) {
          const comment = jsDocs[0].getComment();
          description = typeof comment === 'string' ? comment : undefined;
        }
      }
    } catch (error) {
      // Continue without description if JSDoc extraction fails
    }

    props.push({
      name: propName,
      type: this.simplifyType(typeText),
      required,
      description
    });
  }

  /**
   * Extract props from an interface declaration
   */
  extractPropsFromInterface(interfaceDecl, props) {
    for (const prop of interfaceDecl.getProperties()) {
      this.extractPropFromPropertySignature(prop, props);
    }

    // Handle extended interfaces
    interfaceDecl.getExtends().forEach(ext => {
      const extType = ext.getExpression().getType();
      this.extractPropsFromType(extType, props);
    });
  }

  /**
   * Simplify type text for better readability
   */
  simplifyType(typeText) {
    // Remove import() statements
    typeText = typeText.replace(/import\([^)]+\)\./g, '');
    
    // Simplify React types
    typeText = typeText.replace(/React\.ReactNode/g, 'ReactNode');
    typeText = typeText.replace(/React\.ReactElement/g, 'ReactElement');
    
    // Truncate very long union types
    if (typeText.length > 150) {
      const unionParts = typeText.split('|');
      if (unionParts.length > 3) {
        return unionParts.slice(0, 3).join(' | ') + ' | ...';
      }
    }
    
    return typeText;
  }

  /**
   * Extract stories from the story file and convert to JSX examples
   */
  extractStories(sourceFile, componentName) {
    const stories = [];
    const variables = sourceFile.getVariableDeclarations();
    
    for (const variable of variables) {
      const name = variable.getName();
      
      // Skip meta and default exports
      if (name === 'meta' || name === 'default') continue;
      
      // Look for Story type or exported variables
      const type = variable.getType().getText();
      if (!type.includes('Story') && !variable.isExported()) continue;

      const initializer = variable.getInitializer();
      if (!initializer) continue;

      // Extract JSDoc from the variable declaration
      let jsDoc = undefined;
      
      try {
        if (typeof variable.getJsDocs === 'function') {
          const jsDocs = variable.getJsDocs();
          if (jsDocs && jsDocs.length > 0) {
            const comment = jsDocs[0].getComment();
            jsDoc = typeof comment === 'string' ? comment : undefined;
          }
        }
      } catch (error) {
        // If getJsDocs fails, just continue without JSDoc
        console.warn(`   ⚠️  Could not extract JSDoc for story: ${name}`);
      }

      // Convert story object to JSX
      const jsxCode = this.convertStoryToJSX(initializer, componentName);

      stories.push({
        name,
        code: jsxCode,
        jsDoc
      });
    }

    return stories;
  }

  /**
   * Convert a Storybook story object to JSX code
   */
  convertStoryToJSX(initializer, componentName) {
    const kind = initializer.getKind();
    
    // Handle object literal story format
    if (kind === SyntaxKind.ObjectLiteralExpression) {
      const argsProp = initializer.getProperty('args');
      const renderProp = initializer.getProperty('render');

      // If there's a custom render function, use its JSX
      if (renderProp && renderProp.getKind() === SyntaxKind.PropertyAssignment) {
        const renderFunc = renderProp.getInitializer();
        return this.extractJSXFromRender(renderFunc);
      }

      // Otherwise, construct JSX from args
      if (argsProp && argsProp.getKind() === SyntaxKind.PropertyAssignment) {
        const argsObj = argsProp.getInitializer();
        return this.constructJSXFromArgs(componentName, argsObj);
      }
    }

    return `<${componentName} />`;
  }

  /**
   * Extract JSX from a render function
   */
  extractJSXFromRender(renderFunc) {
    if (!renderFunc) return '';

    // Get the function body
    const body = renderFunc.getBody();
    if (!body) return '';

    // If it's a block, find the return statement
    if (Node.isBlock(body)) {
      const returnStatement = body.getStatements().find(stmt => 
        Node.isReturnStatement(stmt)
      );
      
      if (returnStatement) {
        const expression = returnStatement.getExpression();
        if (expression) {
          return this.formatJSX(expression.getText());
        }
      }
    } else {
      // Arrow function with direct return
      return this.formatJSX(body.getText());
    }

    return '';
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

    // For complex expressions, return the text
    return initializer.getText();
  }

  /**
   * Format a prop for JSX output
   */
  formatProp(propName, value, kind) {
    // Boolean true - shorthand
    if (value === 'true') {
      return propName;
    }

    // String literal
    if (kind === SyntaxKind.StringLiteral) {
      return `${propName}="${value}"`;
    }

    // Everything else in curly braces
    return `${propName}={${value}}`;
  }

  /**
   * Format JSX code for better readability
   */
  formatJSX(code) {
    // Basic formatting - remove extra whitespace
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  /**
   * Extract JSDoc from component
   */
  extractComponentJsDoc(sourceFile, componentName) {
    // Try to find the component - could be a function or const with forwardRef
    const functionDecl = sourceFile.getFunction(componentName);
    const variableDecl = sourceFile.getVariableDeclaration(componentName);

    const decl = functionDecl || variableDecl;
    if (!decl) return undefined;

    try {
      if (typeof decl.getJsDocs === 'function') {
        const jsDocs = decl.getJsDocs();
        if (jsDocs && jsDocs.length > 0) {
          const comment = jsDocs[0].getComment();
          return typeof comment === 'string' ? comment : undefined;
        }
      }
    } catch (error) {
      // Return undefined if JSDoc extraction fails
      return undefined;
    }

    return undefined;
  }

  /**
   * Extract JSDoc from the story file (the comment above meta)
   */
  extractStoryJsDoc(sourceFile) {
    // Look for JSDoc on the meta variable
    const metaVar = sourceFile.getVariableDeclaration('meta');
    if (!metaVar) return undefined;

    try {
      if (typeof metaVar.getJsDocs === 'function') {
        const jsDocs = metaVar.getJsDocs();
        if (jsDocs && jsDocs.length > 0) {
          const comment = jsDocs[0].getComment();
          return typeof comment === 'string' ? comment : undefined;
        }
      }
    } catch (error) {
      return undefined;
    }

    return undefined;
  }

  /**
   * Generate markdown files for each component
   */
  async generateMarkdownFiles() {
    console.log('\n📝 Generating markdown files...');

    for (const [, component] of this.components) {
      const categoryDir = path.join(this.outputDir, component.category);
      const mdFilePath = path.join(categoryDir, `${component.name.toLowerCase()}.md`);

      // Ensure directory exists
      fs.mkdirSync(categoryDir, { recursive: true });

      const mdContent = this.buildComponentMarkdown(component);
      fs.writeFileSync(mdFilePath, mdContent, 'utf-8');
      
      console.log(`   ✓ ${mdFilePath}`);
    }
  }

  /**
   * Build markdown content for a component using composition
   */
  buildComponentMarkdown(component) {
    const sections = [];

    sections.push(this.composeTitle(component.name));
    
    if (component.jsDoc) {
      sections.push(this.composeDescription(component.jsDoc));
    }

    if (component.props.length > 0) {
      // composeProps returns an array, so spread it
      sections.push(...this.composeProps(component.props));
    }

    if (component.stories.length > 0) {
      // composeExamples returns an array, so spread it
      sections.push(...this.composeExamples(component.stories));
    }

    const tree = root(sections);
    return toMarkdown(tree);
  }

  /**
   * Compose the title section
   */
  composeTitle(name) {
    return heading(1, text(name));
  }

  /**
   * Compose the description section
   */
  composeDescription(description) {
    return paragraph(text(description));
  }

  /**
   * Compose the props section
   */
  composeProps(props) {
    const content = [];
    
    content.push(heading(2, text('Props')));
    
    // Build markdown table manually as a code block
    const tableLines = [];
    tableLines.push('| Prop | Type | Required | Description |');
    tableLines.push('|------|------|----------|-------------|');
    
    for (const prop of props) {
      const propName = this.escapeMarkdown(prop.name);
      const propType = this.escapeMarkdown(prop.type);
      const required = prop.required ? 'Yes' : 'No';
      const description = this.escapeMarkdown(prop.description || '');
      
      tableLines.push(`| ${propName} | \`${propType}\` | ${required} | ${description} |`);
    }
    
    // Use html node to embed raw markdown table
    content.push({
      type: 'html',
      value: tableLines.join('\n')
    });
    
    return content;
  }

  /**
   * Escape special markdown characters in table cells
   */
  escapeMarkdown(str) {
    return str
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '');
  }

  /**
   * Compose the examples section
   */
  composeExamples(stories) {
    const content = [];
    
    content.push(heading(2, text('Examples')));

    for (const story of stories) {
      content.push(...this.composeExample(story));
    }

    return content;
  }

  /**
   * Compose a single example
   */
  composeExample(story) {
    const content = [];

    content.push(this.composeExampleTitle(story.name));

    if (story.jsDoc) {
      content.push(this.composeExampleDescription(story.jsDoc));
    }

    content.push(this.composeExampleCode(story.code));

    return content;
  }

  /**
   * Compose an example title
   */
  composeExampleTitle(name) {
    return heading(3, text(name));
  }

  /**
   * Compose an example description
   */
  composeExampleDescription(description) {
    // Handle multiline descriptions and preserve markdown formatting
    const lines = description.split('\n').map(line => line.trim()).filter(line => line);
    return paragraph(text(lines.join(' ')));
  }

  /**
   * Compose an example code block
   */
  composeExampleCode(codeText) {
    return code('jsx', codeText);
  }

  /**
   * Generate the main llms.txt file
   */
  async generateLLMSTxt() {
    console.log('\n📄 Generating llms.txt...');

    const content = [];

    // H1: Project name
    const projectName = this.getProjectName();
    content.push(heading(1, text(projectName)));

    // Blockquote: Summary
    content.push(
      blockquote(
        paragraph(
          text(`Component documentation for ${projectName}. This documentation is auto-generated from Storybook stories and provides comprehensive information about all available components, their props, and usage examples.`)
        )
      )
    );

    // Group components by category
    const categorizedComponents = this.categorizeComponents();

    // Create sections for each category
    for (const [category, components] of categorizedComponents) {
      const categoryTitle = this.capitalizeWords(category.replace(/\//g, ' / '));
      content.push(heading(2, text(categoryTitle)));

      const componentLinks = [];

      for (const component of components) {
        const componentPath = `https://system.damato.design/${component.category}/${component.name.toLowerCase()}.md`;
        const description = component.storyJsDoc || component.jsDoc 
          ? this.truncateDescription(component.storyJsDoc || component.jsDoc)
          : `${component.name} component with ${component.props.length} props and ${component.stories.length} examples`;
        
        componentLinks.push(
          listItem(
            paragraph([
              link(componentPath, component.name, text(component.name)),
              text(`: ${description}`)
            ])
          )
        );
      }

      content.push(list('unordered', componentLinks));
    }

    const tree = root(content);
    const markdown = toMarkdown(tree);

    const llmsTxtPath = path.join(this.outputDir, 'llms.txt');
    fs.writeFileSync(llmsTxtPath, markdown, 'utf-8');

    console.log(`   ✓ ${llmsTxtPath}`);
  }

  /**
   * Truncate description to first sentence or 150 chars
   */
  truncateDescription(description) {
    // Remove extra whitespace
    description = description.replace(/\s+/g, ' ').trim();
    
    // Get first sentence
    const firstSentence = description.split(/[.!?]\s/)[0];
    
    if (firstSentence.length <= 150) {
      return firstSentence;
    }
    
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
   * Categorize components by their category
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

    // Sort components within each category
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