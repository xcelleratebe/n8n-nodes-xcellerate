import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { xcellerateApiRequest } from '../../transport';
import { agentUuid } from '../../descriptions';

export const properties: INodeProperties[] = [
	... agentUuid,
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
	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.agent as IDataObject),
		{ itemData: { item: index } },
	);
}
