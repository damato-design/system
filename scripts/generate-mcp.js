#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

/**
 * Extract JSDoc description from a node
 */
function extractJSDoc(node) {
    const jsDocs = node.getJsDocs();
    if (jsDocs.length === 0) return '';

    return jsDocs
        .map(doc => doc.getDescription().trim())
        .filter(Boolean)
        .join('\n');
}

/**
 * Extract default value from JSDoc tags
 */
function extractDefaultValue(node) {
    const jsDocs = node.getJsDocs();

    for (const doc of jsDocs) {
        const defaultTag = doc.getTags().find(tag => tag.getTagName() === 'default');
        if (defaultTag) {
            return defaultTag.getCommentText()?.trim();
        }
    }

    return undefined;
}

/**
 * Extract prop types from a TypeScript interface or type
 */
function extractProps(sourceFile) {
    const props = [];

    // Find interfaces ending with "Props"
    const interfaces = sourceFile.getInterfaces()
        .filter((iface) => iface.getName().endsWith('Props'));

    for (const iface of interfaces) {
        for (const prop of iface.getProperties()) {
            const propName = prop.getName();
            const isRequired = !prop.hasQuestionToken();
            const typeText = prop.getType().getText();
            const description = extractJSDoc(prop);
            const defaultValue = extractDefaultValue(prop) ||
                prop.getInitializer()?.getText();

            props.push({
                name: propName,
                type: typeText,
                required: isRequired,
                description,
                defaultValue,
            });
        }
    }

    // Find type aliases ending with "Props" (including _BoxProps pattern)
    const typeAliases = sourceFile.getTypeAliases()
        .filter((type) => {
            const name = type.getName();
            return name.endsWith('Props') || name.match(/^_[A-Z]\w*Props$/);
        });

    for (const typeAlias of typeAliases) {
        const typeNode = typeAlias.getTypeNode();

        if (typeNode && typeNode.getKind() === SyntaxKind.TypeLiteral) {
            for (const member of typeNode.getMembers()) {
                if (member.getKind() === SyntaxKind.PropertySignature) {
                    const prop = member;
                    const propName = prop.getName();
                    const isRequired = !prop.hasQuestionToken();
                    const typeText = prop.getType().getText();
                    const description = extractJSDoc(prop);
                    const defaultValue = extractDefaultValue(prop);

                    props.push({
                        name: propName,
                        type: typeText,
                        required: isRequired,
                        description,
                        defaultValue,
                    });
                }
            }
        }

        // Handle intersection types (e.g., Type1 & Type2 & {...})
        if (typeNode && typeNode.getKind() === SyntaxKind.IntersectionType) {
            const intersectionType = typeNode;
            for (const typeRef of intersectionType.getTypeNodes()) {
                if (typeRef.getKind() === SyntaxKind.TypeLiteral) {
                    for (const member of typeRef.getMembers()) {
                        if (member.getKind() === SyntaxKind.PropertySignature) {
                            const prop = member;
                            const propName = prop.getName();
                            const isRequired = !prop.hasQuestionToken();
                            const typeText = prop.getType().getText();
                            const description = extractJSDoc(prop);
                            const defaultValue = extractDefaultValue(prop);

                            props.push({
                                name: propName,
                                type: typeText,
                                required: isRequired,
                                description,
                                defaultValue,
                            });
                        }
                    }
                }
            }
        }
    }

    return props;
}

/**
 * Extract story examples with their JSDoc from a .stories.tsx file
 */
function extractStories(project, filePath) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const stories = [];

    // Find exported variable declarations (stories)
    const statements = sourceFile.getVariableStatements()
        .filter(statement => statement.isExported());

    for (const statement of statements) {
        // Get JSDoc from the statement itself
        const statementDescription = extractJSDoc(statement);

        for (const declaration of statement.getDeclarations()) {
            const name = declaration.getName();

            // Skip default export and meta
            if (name !== 'default' && !name.toLowerCase().includes('meta')) {
                // Try to get JSDoc from the declaration if not on statement
                const description = statementDescription || extractJSDoc(declaration);

                stories.push({
                    name,
                    description: description || undefined,
                });
            }
        }
    }

    return stories;
}

function getMetaObjectLiteral(defaultDecl) {
    // Inline: export default { ... }
    let obj = defaultDecl.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
    if (obj) return obj;

    // Identifier: export default meta
    const identifier = defaultDecl.getFirstDescendantByKind(SyntaxKind.Identifier);
    if (!identifier) return undefined;

    const varDecl = identifier.getDefinitionNodes()[0];
    if (!varDecl) return undefined;

    // initializer can be:
    // - ObjectLiteralExpression
    // - SatisfiesExpression → ObjectLiteralExpression
    const init = varDecl.getInitializer();

    if (!init) return undefined;

    if (init.getKind() === SyntaxKind.ObjectLiteralExpression) {
        return init;
    }

    if (init.getKind() === SyntaxKind.SatisfiesExpression) {
        const inner = init.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
        if (inner) return inner;
    }

    return undefined;
}


function storybookSlug(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")     // non-alphanum → hyphen
        .replace(/(^-|-$)/g, "");        // trim hyphens
}


/**
 * Process a component directory
 */
function processComponent(project, componentDir, componentName, baseUrl) {
    const indexPath = path.join(componentDir, 'index.tsx');
    const storiesPath = path.join(componentDir, 'index.stories.tsx');

    const sourceFile = project.addSourceFileAtPath(indexPath);

    // Extract component-level JSDoc from the default export or main function
    let componentDescription = '';

    // Try to find the main component (default export or named export matching component name)
    const defaultExport = sourceFile.getDefaultExportSymbol();
    const functions = sourceFile.getFunctions();
    const variables = sourceFile.getVariableStatements();

    // Check default export
    if (defaultExport) {
        const declarations = defaultExport.getDeclarations();
        if (declarations.length > 0) {
            const decl = declarations[0];
            if ('getJsDocs' in decl) {
                componentDescription = extractJSDoc(decl);
            }
        }
    }

    // Check functions
    if (!componentDescription) {
        for (const func of functions) {
            if (func.getName() === componentName) {
                componentDescription = extractJSDoc(func);
                break;
            }
        }
    }

    // Check variable declarations
    if (!componentDescription) {
        for (const statement of variables) {
            for (const decl of statement.getDeclarations()) {
                if (decl.getName() === componentName) {
                    componentDescription = extractJSDoc(statement);
                    break;
                }
            }
        }
    }

    const props = extractProps(sourceFile);
    const examples = fs.existsSync(storiesPath)
        ? extractStories(project, storiesPath)
        : [];

    // Create Storybook URL
    const storyFile = project.addSourceFileAtPathIfExists(storiesPath);
    if (!storyFile) return {};

    const exportAssignment = storyFile.getFirstDescendantByKind(SyntaxKind.ExportAssignment);
    const expr = exportAssignment.getExpression();
    const decl = expr.getSymbol()?.getDeclarations()?.[0];
    const satisfiesExpr = decl.getFirstChildByKind(SyntaxKind.SatisfiesExpression);
    const objLiteral = satisfiesExpr.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);

    const metaTitle = objLiteral
        .getProperty("title")
        ?.getFirstDescendantByKind(SyntaxKind.StringLiteral)
        ?.getLiteralText();

    const uri = `${baseUrl}/?path=/docs/${storybookSlug(metaTitle)}--docs`;

    return {
        uri,
        name: componentName,
        description: componentDescription || `${componentName} component`,
        mimeType: 'text/typescript',
        _meta: {
            props,
            examples,
            category: 'component',
        },
    };
}

/**
 * Process an MDX documentation file
 */
function processDoc(docPath, docsRoot, baseUrl) {
    const content = fs.readFileSync(docPath, 'utf-8');
    const relativePath = path.relative(docsRoot, docPath);
    const name = path.basename(docPath, '.mdx');

    // Extract title from frontmatter or first heading
    const titleMatch = content.match(/^#\s+(.+)$/m) ||
        content.match(/title:\s*['"](.+)['"]/);
    const title = titleMatch ? titleMatch[1] : name;

    // Create a URL-friendly path
    const urlPath = relativePath
        .replace(/\.mdx$/, '')
        .replace(/\\/g, '/')
        .toLowerCase();

    const uri = `${baseUrl}/?path=/docs/${urlPath}--docs`;

    return {
        uri,
        name: title,
        text: content,
        mimeType: 'text/mdx',
        _meta: {
            category: 'documentation',
        },
    };
}

function serverCard(domain) {
    return {
        $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
        version: "1.0",
        protocolVersion: "2025-06-18",
        serverInfo: {
            name: `${domain}-damato-mcp`,
            version: "1.0.0"
        },
        resources: [
            {
                name: `${domain}-damato-mcp-resources`,
                uri: `https://${domain}.damato.design/.well-known/mcp/resources.json`,
                mimeType: "application/json"
            }
        ]
    }
}

/**
 * Main function to generate resources.json
 */
function generateMCP() {
    const baseUrl = 'https://system.damato.design';
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
        skipAddingFilesFromTsConfig: false,
    });

    const resources = [];

    // Process documentation files
    const docsDir = path.join(process.cwd(), 'docs');
    if (fs.existsSync(docsDir)) {
        function scanDocs(dir) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    scanDocs(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
                    resources.push(processDoc(fullPath, docsDir, baseUrl));
                }
            }
        }

        scanDocs(docsDir);
    }

    // Process components
    const componentsDir = path.join(process.cwd(), 'src', 'components');
    if (fs.existsSync(componentsDir)) {
        const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
            .filter(entry => entry.isDirectory());

        for (const dir of componentDirs) {
            const componentPath = path.join(componentsDir, dir.name);
            const indexPath = path.join(componentPath, 'index.tsx');

            if (fs.existsSync(indexPath)) {
                resources.push(processComponent(project, componentPath, dir.name, baseUrl));
            }
        }
    }

    const output = { resources: resources.filter(r => Object.keys(r).length > 0) };

    // Ensure src/assets directory exists
    const assetsDir = path.join(process.cwd(), 'src', 'assets', '.well-known', 'mcp');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Write to src/assets/.well-known/mcp/resources.json
    const resourcesPath = path.join(assetsDir, 'resources.json');
    fs.writeFileSync(resourcesPath, JSON.stringify(output, null, 2));

    const serverCardOutput = serverCard('system');

    // Write to src/assets/.well-known/mcp/server-card.json
    const serverCardPath = path.join(assetsDir, 'server-card.json');
    fs.writeFileSync(serverCardPath, JSON.stringify(serverCardOutput, null, 2));

    console.log(`✅ Generated resources.json with ${resources.length} resources`);
    console.log(`   - ${resources.filter(r => r._meta?.category === 'documentation').length} documentation files`);
    console.log(`   - ${resources.filter(r => r._meta?.category === 'component').length} components`);
}

// Run the generator
generateMCP();