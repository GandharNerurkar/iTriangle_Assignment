import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface SelectDropdownProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  options: { value: string; label: string }[];
}

function SelectDropdown({ label, value, onChange, options }: SelectDropdownProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectDropdown;
