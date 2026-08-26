import 'react/jsx-dev-runtime';
import type { AppDescriptor } from 'shell';
import App from './App';

const descriptor: AppDescriptor = {
	id: 'tarun.claimpilot',
	name: 'ClaimPilot',
	branding: {
		appName: 'ClaimPilot AI',
	},
	app: App,
};

export default descriptor;
