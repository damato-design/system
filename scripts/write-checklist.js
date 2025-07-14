import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import {fromMarkdown} from 'mdast-util-from-markdown';
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm';
import {toMarkdown} from 'mdast-util-to-markdown';
import {gfm} from 'micromark-extension-gfm';

const CHECKLIST_YAML_PATH = path.join(process.cwd(), 'scripts', 'checklist.yml');
const COMPONENTS_PATH = path.join(process.cwd(), 'src', 'components');

const listdata = yaml.load(fs.readFileSync(CHECKLIST_YAML_PATH, 'utf-8'));

function findDirectories(rootDir) {
  const result = [];

  function recurse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(currentDir, entry.name);
        result.push(fullPath);
        recurse(fullPath);
      }
    }
  }

  recurse(rootDir);
  return result;
}

function findStrongText(node) {
  if (node.type === 'strong') {
    return node.children
      ?.filter(child => child.type === 'text')
      .map(child => child.value)
      .join('');
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const result = findStrongText(child);
      if (result) return result;
    }
  }

  return null;
}

function ensureChecklistStructure(tree) {
  if (!tree.children.find(n => n.type === 'heading')) {
    tree.children.push({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: 'Checklist' }]
    });
  }

  if (!tree.children.find(n => n.type === 'list')) {
    tree.children.push({
      type: 'list',
      ordered: false,
      start: null,
      spread: false,
      children: []
    });
  }

  return tree.children.at(-1);
}

function itemCreate(label, description) {
  return {
    type: 'listItem',
    spread: false,
    checked: false,
    children: [{
      type: 'paragraph',
      children: [
        { type: 'strong', children: [{ type: 'text', value: label }]},
        { type: 'text', value: ` ${description}` } // space for separation
      ]
    }]
  };
}

findDirectories(COMPONENTS_PATH).forEach((dir) => {
  const checklistPath = path.join(dir, 'checklist.md');
  const fd = fs.openSync(checklistPath, 'r+');
  const stats = fs.fstatSync(fd);
  const buffer = Buffer.alloc(stats.size);
  fs.readSync(fd, buffer, 0, stats.size, 0);

  const tree = fromMarkdown(buffer.toString(), {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()]
  });

  const list = ensureChecklistStructure(tree);

  const existingLabels = new Set(
    list.children
      .map(findStrongText)
      .filter(Boolean) // ignore nulls
  );

  Object.entries(listdata).forEach(([label, description]) => {
    if (!existingLabels.has(label)) {
      list.children.push(itemCreate(label, description));
    }
  });

  // Truncate and write back the file
  fs.ftruncateSync(fd);
  fs.writeSync(fd, toMarkdown(tree, { extensions: [gfmToMarkdown()] }));
  fs.closeSync(fd);
});
