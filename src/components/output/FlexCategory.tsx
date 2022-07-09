import Category, { Props } from "./Category";

export default function FlexCategory({name, style, ...props}: Props) {
	return (<div style={{display: 'inline-flex'}}>
		<Category
			name={name}
			style={style}
		>
			{props.children}
		</Category>
	</div>);
}

export type {Props} from './Category';