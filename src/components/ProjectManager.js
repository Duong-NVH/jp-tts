import React from "react";
import {
  Box,
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
const ProjectManager = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.tableHead}>
            <TableCell>ID</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>...</TableBody>
      </Table>
    </Box>
  );
};
const useStyles = makeStyles({
  root: {
    width: "45%",
    maxHeight: 800,
  },
  tableHead: {
    "&>*": {
      textAlign: "center",
      fontSize: 20,
    },
    "&>:first-child": {
      width: 20,
    },
    "&>:nth-child(3)": {
      width: 50,
    },
  },
});
export default ProjectManager;
