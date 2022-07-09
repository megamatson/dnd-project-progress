import { useFormikContext } from 'formik';
import '../../css/Button.css';
import '../../css/Controls.css';
import FormValues from '../../FormValues';

export interface Props {}

function ControlButton(
	{children, ...props}: Omit<
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>,
		'className'|'button'
	>
) {
	return (<button
		className='control'
		type='button'
		{...props}
	>
		{children}
	</button>);
}

export default function Controls(props: Props) {
	const context = useFormikContext<FormValues>();

	if (!context.isValid)
		return null;

	return (<>
		<ControlButton
			onClick={() => console.log('next day')}
		>
			Next Day
		</ControlButton>
	</>);
}