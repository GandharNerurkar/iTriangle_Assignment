import type { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  iconColor?: string;
  iconBackground?: string;
}

function SummaryCard({
  label,
  value,
  icon,
  iconColor = '#1976d2',
  iconBackground = '#e8f1ff',
}: SummaryCardProps) {
  return (
    <Card elevation={0} className="summary-card">
      <CardContent className="summary-card__content">
        <Box className="summary-card__icon" sx={{ color: iconColor, backgroundColor: iconBackground }}>
          {icon}
        </Box>
        <Box>
          <Typography className="summary-card__label" color="text.secondary" gutterBottom>
              {label}
          </Typography>
          <Typography className="summary-card__value" variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
