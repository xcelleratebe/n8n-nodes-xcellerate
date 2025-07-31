import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { xcellerateApiRequest } from '../../transport';

export const properties: INodeProperties[] = [
	{
		displayName: 'Agent UUID',
		name: 'agentUuid',
		description: 'The UUID of the agent to fetch data from',
		type: 'string',
		required: true,
		default: '',
	},
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['get'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {
	const uuid = this.getNodeParameter('agentUuid', index) as string;
	const responseData = await xcellerateApiRequest.call(
		this,
		`/agents/${uuid}`,
	)
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.agent as IDataObject),
		{ itemData : { item: index } },
	)

	return executionData;
}
