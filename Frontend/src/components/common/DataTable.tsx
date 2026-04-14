import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface Column<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  renderCell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  noDataMessage?: string;
}

function DataTable<T extends { id: string }>({ columns, rows, noDataMessage = 'No records found.' }: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.field)} sx={{ fontWeight: 700 }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box p={4} textAlign="center">
                  <Typography color="text.secondary">{noDataMessage}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={String(column.field)}>
                    {column.renderCell ? column.renderCell(row) : (row[column.field] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
