import type React from 'react'
import { ForkRiskProvider } from '../contexts/ForkRiskContext'
import { DemoProvider } from '../contexts/DemoContext'
import { ForkMeter } from './ForkMeter'
import { DemoOverlay } from './DemoOverlay'

export const App = (): React.JSX.Element => {
	return (
		<ForkRiskProvider>
			<DemoProvider>
				<DemoOverlay>
					<ForkMeter />
				</DemoOverlay>
			</DemoProvider>
		</ForkRiskProvider>
	)
}
