/**
 * Types for workflow visualization
 */

// Normalized node position for canvas rendering
export interface CanvasNode {
  id: string;
  name: string;
  type: string;
  shortType: string;
  category: NodeCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  hasCredentials: boolean;
  credentialTypes: string[];
}

// Connection between nodes
export interface CanvasConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceOutput: number;
  targetInput: number;
}

// Node category for color coding
export type NodeCategory =
  | 'trigger'
  | 'http'
  | 'code'
  | 'logic'
  | 'transform'
  | 'action'
  | 'note'
  | 'default';

// Viewport bounds calculated from node positions
export interface ViewportBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

// Canvas configuration
export interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
  nodeWidth: number;
  nodeHeight: number;
  gridSize: number;
}

// Parsed workflow data ready for rendering
export interface ParsedWorkflow {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  bounds: ViewportBounds;
  hasValidConnections: boolean;
}

// Color scheme for node categories
export interface NodeColors {
  bg: string;
  border: string;
  text: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
}

// n8n connection format (from workflow JSON)
export interface N8nConnectionOutput {
  node: string;
  type: string;
  index: number;
}

export interface N8nConnections {
  [nodeNameOrId: string]: {
    main?: N8nConnectionOutput[][];
    [outputType: string]: N8nConnectionOutput[][] | undefined;
  };
}

// Required credential info extracted from workflow
export interface RequiredCredential {
  type: string;
  name: string;
  nodeNames: string[];
  icon: string;
  docsUrl: string;
}

// Workflow complexity level
export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'advanced';

// Complexity analysis result
export interface ComplexityAnalysis {
  level: ComplexityLevel;
  score: number;
  factors: {
    nodeCount: number;
    credentialCount: number;
    hasCodeNodes: boolean;
    hasBranching: boolean;
    hasLoops: boolean;
    integrationCount: number;
  };
}

// Use case for workflow
export interface UseCase {
  title: string;
  scenario: string;
  benefit: string;
  icon?: string;
  industryTag?: string;
}

// n8n instance settings for import
export interface N8nInstanceSettings {
  instanceUrl: string;
  type: 'cloud' | 'self-hosted' | 'local';
  lastUsed: string;
}
