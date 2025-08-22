import type React from 'react'
import { ForkRiskProvider } from '../contexts/ForkRiskContext'
import { ForkMeter } from './ForkMeter'

export const App = (): React.JSX.Element => {
	return (
		<ForkRiskProvider>
			<ForkMeter />
		</ForkRiskProvider>
	)
}
