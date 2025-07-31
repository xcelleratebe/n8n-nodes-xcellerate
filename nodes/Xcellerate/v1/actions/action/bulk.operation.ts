import {
  DeclarativeRestApiSettings,
  IDataObject,
  IExecuteFunctions,
  INodeProperties,
  updateDisplayOptions
} from "n8n-workflow";
import { xcellerateApiRequest } from '../../transport';
import HttpRequestOptions = DeclarativeRestApiSettings.HttpRequestOptions;

export const properties: INodeProperties[] = [
	{
		displayName: 'Action UUID',
		name: 'actionUuid',
		description: 'The UUID of the action to fetch status from',
		type: 'string',
		required: true,
		default: '',
	},
];

const displayOptions = {
	show: {
		resource: ['action'],
		operation: ['bulk'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {

  const items = this.getInputData();
  let actionUuids = [];
  for (const key in items) {
    actionUuids.push(this.getNodeParameter('actionUuid', Number.parseInt(key)));
  }

  let httpOptions: HttpRequestOptions = {
    body: {}
  };
  httpOptions.body = {
    uuids: actionUuids,
  }
  this.logger.warn(JSON.stringify(actionUuids));

	const responseData = await xcellerateApiRequest.call(
		this,
		`/actions/bulk`,
    httpOptions
	)


	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.data as IDataObject),
		{ itemData : { item: index } },
	)

	return executionData;
}
