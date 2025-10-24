import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { queryAble, returnAllOrLimit } from '../../descriptions';
import { buildHttpRequest, xcellerateApiRequest } from '../../transport';

export const properties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: "number",
		required: true,
		default: null,
	},
	... returnAllOrLimit,
	... queryAble,
];

const displayOptions = {
	show: {
		resource: ['group'],
		operation: ['listAgents'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {
	const id = this.getNodeParameter('groupId', index);
	const returnAll = this.getNodeParameter('returnAll', index);

	let requestOptions = buildHttpRequest({});

	const responseData = await xcellerateApiRequest.call(
		this,
		`/groups/${id}/agents`,
		requestOptions,
		returnAll,
		{
			index: index,
		}
	)

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject),
		{ itemData: { item: index } },
	);
}

