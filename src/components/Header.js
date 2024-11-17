import React from 'react';
import {
	EuiHeader,
	EuiHeaderSectionItem,
} from '@elastic/eui';

export default () => {
	return (
		<EuiHeader theme="dark">
			<EuiHeaderSectionItem style={{fontWeight:600, color: "white"}}>
				{process.env.REACT_APP_TITLE}
			</EuiHeaderSectionItem>
		</EuiHeader>
	);
};