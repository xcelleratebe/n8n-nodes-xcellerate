import { IExecuteFunctions } from 'n8n-workflow';

export function getActionFromNode(this: IExecuteFunctions, index: number) {
	const command = this.getNodeParameter('command', 0) as string;
	let properties = this.getNodeParameter('properties', 0, '{}') as string;
	let objectProperties = JSON.parse(properties);

	if (command === 'APPDEPLOYUPD') {
		objectProperties = {
			packages: this.getNodeParameter('packages.packageValues', 0, [])
		}
	}

	return {
		command: command,
		properties: objectProperties
	}
}
