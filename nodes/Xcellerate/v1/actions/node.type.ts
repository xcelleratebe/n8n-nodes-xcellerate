import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	agent: 'list' | 'get' | 'sendAction' | 'sendScript',
	group: 'list' | 'listAgents',
	action: 'bulk',
	vulnerability: 'list' | 'get' | 'user' | 'assign',
}

export type Xcellerate = AllEntities<NodeMap>
