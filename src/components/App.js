// import './App.css';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
  EuiText,
  EuiPageTemplate,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFilePicker,
  EuiComboBox,
  EuiFormRow,
} from '@elastic/eui';
import Header from './Header';
import pluralize from 'pluralize';

function App() {

  const [file1, setFile1] = useState({})
  const [file2, setFile2] = useState({})
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])

  const [gios, setGIOs] = useState([])
  const [selectedGIOs, setSelectedGIOs] = useState([])

  const [statuses, setStatuses] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])

  function readFile(fileTag, files) {
    const setFile = (fileTag === 1) ? setFile1 : setFile2
    const setData = (fileTag === 1) ? setData1 : setData2
    const fs = files.length > 0 ? files : {}
    setFile(fs)
    if (files.length === 0) {
      console.log(files)
      return
    }
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
    }
    reader.readAsText(fs[0])
  }

  const populateSelections = () => {
    const gioTags = new Set()
    const statuses = new Set()
    data1.concat(data2).forEach(d => {
      gioTags.add(d['gio_tagging'])
      statuses.add(d['status'])
    })
    setGIOs([...gioTags].map(o => ({ label: o })).toSorted())
    setStatuses([...statuses].map(o => ({ label: o })).toSorted())
  }

  useEffect(() => {
    console.log(data1)
    if (data1.length === 0 || data2.length === 0) {
      return
    }
    populateSelections()
  }, [data1, data2])

  const getOptions = (name, options, selected, setSelected) => {
    const key = name.replace('_').toLowerCase()
    return <EuiFormRow label={name} fullWidth>
      <EuiComboBox
        key={`${key}_combo`}
        aria-label={`${name} combo`}
        placeholder={`Select ${pluralize(name)}`}
        options={options}
        selectedOptions={selected}
        onChange={(o) => setSelected(o)}
        // onCreateOption={onCreateOption}
        isClearable={true}
        // data-test-subj="demoComboBox"
        compressed
        fullWidth
        autoFocus
      />
    </EuiFormRow>
  }

  return (
    <EuiPageTemplate
      panelled={true}
      restrictWidth={false}
      bottomBorder={'extended'}
      // offset={offset}
      grow={true}
    >
      <Header />
      <EuiPageTemplate.Section>
        <EuiFlexGroup direction='column' gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem grow={true}>
                <EuiFormRow label={'PAX file 1'} fullWidth>
                  <EuiFilePicker
                    initialPromptText="Select or drag a pax csv file"
                    onChange={(f) => readFile(1, f)}
                    display="default"
                    aria-label="file1 picker"
                    accept=".csv"
                    compressed
                    fullWidth
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                <EuiFormRow label={'PAX file 2'} fullWidth>
                  <EuiFilePicker
                    initialPromptText="Select or drag a pax csv file"
                    onChange={(f) => readFile(2, f)}
                    display="default"
                    aria-label="file2 picker"
                    accept=".csv"
                    compressed
                    fullWidth
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem grow={true}>
                {getOptions('GIO Tag', gios, selectedGIOs, setSelectedGIOs)}
              </EuiFlexItem>
              <EuiFlexItem grow={true}>
                {getOptions('Status', statuses, selectedStatuses, setSelectedStatuses)}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

export default App;
