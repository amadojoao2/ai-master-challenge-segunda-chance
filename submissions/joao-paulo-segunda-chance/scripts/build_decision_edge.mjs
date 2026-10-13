// Single-file JavaScript package derived from canonical TypeScript + domain source.
// Run npm install in web/frontend first. No credentials or network access.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from '../web/frontend/node_modules/typescript/lib/typescript.js';
const args=process.argv.slice(2);
if(args.length!==2||args[0]!=='--output')throw Error('Usage: node scripts/build_decision_edge.mjs --output /path/index.js');
const root=fileURLToPath(new URL('../',import.meta.url));
const entry=await fs.readFile(path.join(root,'web/decisions/index.ts'),'utf8');
const module=await fs.readFile(path.join(root,'web/domain/decision_scope.mjs'),'utf8');
const statement="import {normalizeScope,validateMetric} from '../domain/decision_scope.mjs';";
if(entry.split(statement).length!==2)throw Error('Unexpected domain import; review packaging.');
const combined=entry.replace(statement,module.replaceAll('export function ','function '));
const result=ts.transpileModule(combined,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true});
if(result.diagnostics?.length)throw Error('TypeScript syntax diagnostics; review adapter.');
const output=path.resolve(args[1]);await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,result.outputText);
process.stdout.write('Decision adapter packaged as JavaScript; no secrets included.\n');
