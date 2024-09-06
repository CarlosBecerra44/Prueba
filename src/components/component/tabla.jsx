"use client"

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function TablaMUI({ rows = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Evento</TableCell>
            <TableCell align="">Marca</TableCell>
            <TableCell align="">Lugar</TableCell>
            <TableCell align="">Fecha</TableCell>
            <TableCell align="">Gasto/Presupuesto</TableCell>
            <TableCell align="">Total</TableCell>
            <TableCell align="">Gasto real</TableCell>
            <TableCell align="">Venta total</TableCell>
            <TableCell align="">ROI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.nombre}>
                <TableCell component="th" scope="row">
                  {row.nombre}
                </TableCell>
                <TableCell align="right">{row.edad}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

