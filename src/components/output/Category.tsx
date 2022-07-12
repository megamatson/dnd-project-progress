import _ from "lodash";
import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import ReactPropsOf from "../../types/ReactPropsOf";

import '../../css/Clickable.css';

type Children = ReactPropsOf<HTMLHeadingElement>['children'];

export type Props = {
	name?: string
	children?: Children,
	collapsed?: boolean,
	onCollapsedChange?(b: boolean): void,

	headerRenderer?: React.FC<{children: Children}>;
} & ReactPropsOf<HTMLDivElement>;

export default function Category(
	{
		name,
		children,
		collapsed,
		onCollapsedChange,
		headerRenderer,
		...props
	}: Props
) {
	const {value: isCollapsed, set: setIsOpened} = useLocalStorage<boolean>(
		name + 'IsCollapsed',
		collapsed ?? false
	);

	if (_.isUndefined(children))
		return null;

	const renderer: React.FC<{children: Children}> =
		headerRenderer ?? (({children}) => <h2>{children}</h2>);

	return (<div {...props}>
		{renderer({
			children: (<>
				<span
					onClick={() => {
						const newValue = !isCollapsed;
						setIsOpened(newValue);
						onCollapsedChange?.(newValue);
					}}
					className='clickable'
				>{isCollapsed ? '+' : '-'}</span> {name}
			</>)
		})}
		{isCollapsed ? null : children}
	</div>)
	;
}