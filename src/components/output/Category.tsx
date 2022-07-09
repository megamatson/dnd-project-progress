import _ from "lodash";
import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import ReactPropsOf from "../../types/ReactPropsOf";

import '../../css/Clickable.css';

export type Props = {
	name?: string
	children?: React.ReactNode,
	collapsed?: boolean,
	onCollapsedChange?(b: boolean): void,
} & ReactPropsOf<HTMLDivElement>;

export default function Category(
	{name, children, collapsed, onCollapsedChange, ...props}: Props
) {
	const {value: isCollapsed, set: setIsOpened} = useLocalStorage<boolean>(
		name + 'IsCollapsed',
		collapsed ?? false
	);

	if (_.isUndefined(children))
		return null;

	return (<div {...props}>
		<h2><span
			onClick={() => {
				const newValue = !isCollapsed;
				setIsOpened(newValue);
				onCollapsedChange?.(newValue);
			}}
			className='clickable'
		>{isCollapsed ? '+' : '-'}</span> {name}</h2>
		{isCollapsed ? null : children}
	</div>)
	;
}