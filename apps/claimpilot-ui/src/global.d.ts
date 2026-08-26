/** ClaimPilot pipeline files — JSON with a .pipe extension. */
declare module '*.pipe' {

	const value: Record<string, unknown>;
	export default value;
}

declare module 'shell' {
	export interface AppDescriptor {
		id: string;
		name: string;
		branding?: {
			appName?: string;
		};
		app: any;
	}
}

declare namespace React {
	export type FC<P = {}> = (props: P) => any;
	export function useState<T>(initial: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
	export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
	export interface FormEvent<T = any> {
		preventDefault: () => void;
	}
	export interface ChangeEvent<T = any> {
		target: T;
	}
}

declare module 'react' {
	export = React;
}

declare module 'react/jsx-runtime' {
	export const jsx: any;
	export const jsxs: any;
	export const Fragment: any;
}

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}
