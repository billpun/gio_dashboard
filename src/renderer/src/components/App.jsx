// import './App.css';

import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Grid2, MenuItem, TextField } from '@mui/material';
import Header from './Header';
import pluralize from 'pluralize';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CheckIcon from '@mui/icons-material/Check'
import { MuiFileInput } from 'mui-file-input'

function App() {

  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const [filteredData1, setFilteredData1] = useState([])
  const [filteredData2, setFilteredData2] = useState([])

  const [gios, setGIOs] = useState([])
  const [selectedGIOs, setSelectedGIOs] = useState([])

  const [statuses, setStatuses] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])

  function readFile(fileTag, file) {
    if (file === null || file.length === 0) {
      return
    }
    const setFile = (fileTag === 1) ? setFile1 : setFile2
    const setData = (fileTag === 1) ? setData1 : setData2
    const setFilteredData = (fileTag === 1) ? setFilteredData1 : setFilteredData2
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result.split('\n')
      let headers = []
      let data = []
      text.forEach((line, i) => {
        const tokens = line.split(',')
        if (i === 0) {
          headers = tokens
        } else if (headers.length === tokens.length) {
          const values = {}
          tokens.forEach((token, j) => {
            values[headers[j]] = token
          })
          data.push(values)
        }
      })
      setData(data)
      setFilteredData(data)
    }
    reader.readAsText(file)
  }

  const populateSelections = () => {
    const gioTags = new Set()
    const statuses = new Set()
    data1.concat(data2).forEach(d => {
      gioTags.add(d['gio_tagging'])
      statuses.add(d['status'])
    })
    setGIOs([...gioTags].toSorted())
    setStatuses([...statuses].toSorted())
  }

  useEffect(() => {
    console.log(data1)
    if (data1.length === 0 || data2.length === 0) {
      return
    }
    populateSelections()
  }, [data1, data2])

  const filterData = (data, setFilteredData) => {
    if (data.length === 0) {
      return
    }
    const cached = data.filter(d => {
      let valid = true
      if (selectedGIOs.length > 0) {
        valid = valid & selectedGIOs.includes(d['gio_tagging'])
      }
      if (selectedStatuses.length > 0) {
        valid = valid & selectedStatuses.includes(d['status'])
      }
      return valid
    })
    console.log(cached)
    setFilteredData(cached)
  }

  useEffect(() => {
    filterData(data1, setFilteredData1)
    filterData(data2, setFilteredData2)
  }, [selectedGIOs, selectedStatuses])

  const getOptions = (name, options, selected, setSelected) => {
    const key = name.replace('_').toLowerCase()
    return <Autocomplete
      key={key}
      size='small'
      multiple
      options={options}
      getOptionLabel={(option) => option}
      onChange={(e, v) => setSelected(v)}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={name}
          placeholder={`Select ${pluralize(name)}`}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Grid2 container spacing={2} rowSpacing={1} style={{
        padding: 10,
        paddingTop: 75,
      }}>
        <Grid2 container spacing={2} size={12}>
          <Grid2 size={6} flexGrow={true}>
            <MuiFileInput
              size="small"
              variant="outlined"
              value={file1}
              onChange={(e) => readFile(1, e)}
              label='Pax File 1'
              placeholder='Select or drag a pax csv file'
              InputProps={{
                inputProps: {
                  accept: '.csv'
                },
                startAdornment: <AttachFileIcon />
              }}
              fullWidth={true}
              autoFocus={false}
            />
          </Grid2>
          <Grid2 size={6} flexGrow={true}>
            <MuiFileInput
              size="small"
              variant="outlined"
              value={file2}
              onChange={(e) => readFile(2, e)}
              label='Pax File 2'
              placeholder='Select or drag a pax csv file'
              InputProps={{
                inputProps: {
                  accept: '.csv'
                },
                startAdornment: <AttachFileIcon />
              }}
              fullWidth={true}
              autoFocus={false}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2} size={12}>
          <Grid2 size={6} flexGrow={true}>
            {getOptions('GIO Tag', gios, selectedGIOs, setSelectedGIOs)}
          </Grid2>
          <Grid2 size={6} flexGrow={true}>
            {getOptions('Status', statuses, selectedStatuses, setSelectedStatuses)}
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2} size={12}>
          {
            filteredData1.map(d => <div>{d['naa_treatment_p1']}</div>)
          }
        </Grid2>
      </Grid2>
    </Box>

  )
}

export default App
