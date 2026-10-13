"""Package the decision adapter as one TypeScript file, keeping the pure module as source of truth. No secrets or network."""
import argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def build():
 entry=(ROOT/'web/decisions/index.ts').read_text();module=(ROOT/'web/domain/decision_scope.mjs').read_text();statement="import {normalizeScope,validateMetric} from '../domain/decision_scope.mjs';"
 if entry.count(statement)!=1:raise ValueError('Unexpected adapter import; review packaging')
 return entry.replace(statement,module.replace('export function ','function '))
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path,required=True);args=p.parse_args();args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(build());print('Decision adapter packaged; no secrets included.')
if __name__=='__main__':main()
