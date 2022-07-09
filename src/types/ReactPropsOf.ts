type ReactPropsOf<T> = React.DetailedHTMLProps<
	React.InputHTMLAttributes<T>,
	T
>

export default ReactPropsOf;