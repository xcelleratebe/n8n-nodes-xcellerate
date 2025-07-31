import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';
import { XcellerateV1 } from './v1/XcellerateV1.node';

export class Xcellerate extends VersionedNodeType
{
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Xcellerate.app',
			name: 'xcellerate',
			icon: 'file:Xcellerate.svg',
			group: ['transform'],
			defaultVersion: 1,
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume the Xcellerate.app API',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new XcellerateV1(baseDescription),
		}

		super(nodeVersions, baseDescription);
	}
}
