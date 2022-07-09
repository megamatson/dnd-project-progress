import React from "react";

import '../../css/Error.css';

export interface Props {
	error?: string
}

const ErrorText = React.memo(function ErrorText({error}: Props) {
	return error ? <div className="error">{error}</div> : null;
});

export default ErrorText;