/**
 * BidStepIndicator — shows 1-of-5 progress with labels.
 *
 * Editorial style: numbered circles connected by a hairline rule. Active
 * step gets the gold accent; completed steps get the slate fill. Past
 * steps are clickable for re-editing.
 */

import { makeStyles, tokens } from '@fluentui/react-components';
import { Checkmark20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalXL,
    padding: `${tokens.spacingVerticalL} 0`,
    borderTop: '1px solid #C5D0DA',
    borderBottom: '1px solid #C5D0DA',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
    flex: 1,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#5A7186',
    fontFamily: 'inherit',
    fontSize: '12px',
    '&:hover .circle': {
      borderTopColor: '#B8860B',
      borderRightColor: '#B8860B',
      borderBottomColor: '#B8860B',
      borderLeftColor: '#B8860B',
    },
  },
  circle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid #C5D0DA',
    backgroundColor: '#FAF7F2',
    color: '#5A7186',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Fraunces", Georgia, serif',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 120ms ease',
  },
  circleActive: {
    borderTopColor: '#B8860B',
      borderRightColor: '#B8860B',
      borderBottomColor: '#B8860B',
      borderLeftColor: '#B8860B',
    color: '#B8860B',
    backgroundColor: '#FCF6E6',
  },
  circleComplete: {
    borderTopColor: '#1A2B3C',
      borderRightColor: '#1A2B3C',
      borderBottomColor: '#1A2B3C',
      borderLeftColor: '#1A2B3C',
    backgroundColor: '#1A2B3C',
    color: '#FAF7F2',
  },
  label: {
    textAlign: 'center',
    maxWidth: '120px',
    lineHeight: 1.3,
  },
  labelActive: {
    color: '#1A2B3C',
    fontWeight: 600,
  },
  connector: {
    flex: '0 0 24px',
    height: '2px',
    backgroundColor: '#C5D0DA',
    marginTop: '-22px',
  },
  connectorComplete: {
    backgroundColor: '#1A2B3C',
  },
});

const STEPS = [
  { label: 'Company details', description: 'Legal entity & registration' },
  { label: 'Primary contact', description: 'Person responsible' },
  { label: 'Pricing', description: 'Line items & totals' },
  { label: 'Compliance', description: 'Declarations & insurance' },
  { label: 'Documents', description: 'Supporting uploads' },
  { label: 'Review & submit', description: 'Confirm and send' },
];

export interface BidStepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  highestStepReached: number;
  onStepClick: (step: number) => void;
}

export function BidStepIndicator({
  currentStep,
  highestStepReached,
  onStepClick,
}: BidStepIndicatorProps) {
  const styles = useStyles();

  return (
    <div className={styles.root} aria-label="Bid submission progress">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        const isReachable = stepNum <= highestStepReached;

        return (
          <div key={stepNum} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button
              type="button"
              className={styles.step}
              onClick={() => isReachable && onStepClick(stepNum)}
              disabled={!isReachable}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={
                  isComplete
                    ? `${styles.circle} ${styles.circleComplete}`
                    : isActive
                      ? `${styles.circle} ${styles.circleActive}`
                      : styles.circle
                }
              >
                {isComplete ? <Checkmark20Regular /> : stepNum}
              </span>
              <span
                className={
                  isActive ? `${styles.label} ${styles.labelActive}` : styles.label
                }
              >
                {step.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <span
                className={
                  isComplete
                    ? `${styles.connector} ${styles.connectorComplete}`
                    : styles.connector
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}