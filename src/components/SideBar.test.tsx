import { render, screen, act } from '@testing-library/react';
import SideBar from './SideBar';
import { Filters } from './FiltersBar'
import { ISettings } from './settings/SettingsModal'

test('renders buttons', () => {
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => console.log("center my location")}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const tableHideButton = screen.getByText(/Hide table view/i)
  const settingsButton = screen.getByText(/Settings/i)
  const filterBridgesButton = screen.getByText(/Filter bridges/i)
  const centerButton = screen.getByText(/Center on me/i)
  expect(tableHideButton).toBeInTheDocument();
  expect(settingsButton).toBeInTheDocument();
  expect(filterBridgesButton).toBeInTheDocument();
  expect(centerButton).toBeInTheDocument();
})

test('click show hide button', () => {
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => console.log("center my location")}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const tableHideButton = screen.getByText(/Hide table view/i)
  tableHideButton.click()
  const tableShowButton = screen.getByText(/Show table view/i)
  expect(tableShowButton).toBeInTheDocument()
  tableShowButton.click()
  expect(tableHideButton).toBeInTheDocument()
})

test('click settings button', () => {
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => console.log("center my location")}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const settingsButton = screen.getByText(/Settings/i)
  settingsButton.click()
  const databaseButton = screen.getAllByText(/Database/i)[0]
  const messageProcessingButton = screen.getByText(/Message processing/i)
  const brokerStatusPill = screen.getByText(/Broker status/i)
  expect(databaseButton).toBeInTheDocument()
  expect(messageProcessingButton).toBeInTheDocument()
  expect(brokerStatusPill).toBeInTheDocument()
})

test('click center on me button', () => {
  let centerCalls = 0
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => centerCalls++}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const centerButton = screen.getByText(/Center on me/i)
  centerButton.click()
  centerButton.click()
  expect(centerCalls).toEqual(2)
})

test('click filter bridges button', () => {
  let centerCalls = 0
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => centerCalls++}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const filterBridgesButton = screen.getByText(/Filter bridges/i)
  filterBridgesButton.click()
  const uncheckAllButton = screen.getByText(/Uncheck all/i)
  expect(uncheckAllButton).toBeInTheDocument()
  uncheckAllButton.click()
  expect(uncheckAllButton).toBeInTheDocument()
})

test('No beacons present', () => {
  let centerCalls = 0
  render(<SideBar
    activeMarker={0}
    bridges={[]}
    filters={{ bridges: [], beacons: [] }}
    onGoToClick={() => console.log("go to click")}
    onTableClick={() => console.log("table click")}
    setFilters={(_: Filters) => console.log("set filters")}
    setMapCenterMyLocation={() => centerCalls++}
    setSettings={(_: ISettings) => console.log("set settings")}
  />)
  const noMessagesText = screen.getByText(/No messages/i)
  expect(noMessagesText).toBeInTheDocument()
})

test('1 beacon present', () => {
  let tableClicks = 0
  let goToLocationButton = undefined
  act(() => {
    render(<SideBar
      activeMarker={0}
      bridges={[{ coordinates: [0, 0], bridgeName: "test1" }]}
      filters={{ bridges: [], beacons: [] }}
      onGoToClick={() => console.log("go to click")}
      onTableClick={() => tableClicks++}
      setFilters={(_: Filters) => console.log("set filters")}
      setMapCenterMyLocation={() => console.log("center my location")}
      setSettings={(_: ISettings) => console.log("set settings")}
    />)
    const test1TableElement = screen.getAllByText(/test1/i)[0]
    test1TableElement.click()
    goToLocationButton = screen.getByText(/Go to location/i)
    expect(goToLocationButton).toBeInTheDocument()
    test1TableElement.click()
  })
  expect(tableClicks).toEqual(2)
})
