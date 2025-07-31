/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import {
	INodeTypeDescription,
	NodeConnectionType
} from 'n8n-workflow';

import * as agent from './agent';
import * as group from './group';
import * as action from './action';

export const description: INodeTypeDescription = {
	displayName: 'Xcellerate.app',
	name: 'xcellerate',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Consume the Xcellerate.app API',
	defaults: {
		name: 'Xcellerate.APP',
	},
	usableAsTool: true,
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: 'xcellerateApi',
			required: true,
		}
	],
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Agent',
					value: 'agent',
				},
				{
					name: 'Group',
					value: 'group',
				},
				{
					name: 'Action',
					value: 'action',
				}
			],
			default: 'agent',
		},
		... agent.description,
		... group.description,
		... action.description,
	]
};
