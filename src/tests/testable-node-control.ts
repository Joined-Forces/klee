import { IconLibrary } from "../controls/utils/icon-library";
import { Node } from "../data/nodes/node";
import { NodeControl } from "../controls/nodes/node.control";

class TestableNodeControl {
    node: Node; // grant access to protected property for testing
    header?: any; // exists on HeadedNodeControl but not on HeadlessNodeControl
    mainPanel?: any; // access to main panel for info icons

    constructor(nodeControl: NodeControl) {
      Object.assign(this, nodeControl);
      this.node = (nodeControl as any)._node;
      this.mainPanel = (nodeControl as any).mainPanel;
    }

    hasVisibleIcon(): boolean {
      return this.header?.icon?.controlSize?.x > 0 && this.header?.icon?.controlSize?.y > 0;
    }

    hasIcon(icon: IconLibrary): boolean {
      if (!this.mainPanel?.children) return false;

      return this.mainPanel.children.some((child: any) =>
        child.constructor.name === 'NodeInfoIcon' &&
        child.icon?.path === icon
      );
    }
  }

export { TestableNodeControl };
