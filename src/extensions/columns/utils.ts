import { Node, ResolvedPos } from "prosemirror-model";
import { JSONContent } from "@tiptap/core";
import _ from "lodash";

export const buildNode = ({type, content}: JSONContent): JSONContent => content ? { type, content } : { type }

export const buildParagraph = ({content}: Partial<JSONContent>) => buildNode({type: "paragraph", content});

export const buildColumn = ({content}: Partial<JSONContent>) => buildNode({type: "column", content});

export const buildColumnBlock = ({content}: Partial<JSONContent>) => buildNode({type: "columnBlock", content});

export const buildNColumns = (n: number) => {
  const content = [buildParagraph({})]
  const fn = () => buildColumn({ content })
  return _.times(n, fn)
};

interface PredicateProps {
  node: Node;
  pos: number;
}

export type Predicate = (props: PredicateProps) => boolean

export const findParentNodeClosestToPos = ($pos: ResolvedPos, predicate: Predicate) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    const pos = i > 0 ? $pos.before(i) : 0
    if (predicate({ node, pos })) {
      return {
        start: $pos.start(i),
        depth: i,
        node,
        pos,
      };
    }
  }
  throw Error('No parent found')
};
