import { TextField } from '@mui/material';

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
}

function FormInput({ label, name, value, onChange, type = 'text' }: FormInputProps) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      type={type}
      onChange={(event) => onChange(event.target.value)}
      variant="outlined"
      size="small"
    />
  );
}

export default FormInput;
