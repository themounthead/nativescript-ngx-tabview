# Nativescript-Ngx-TabView

A Nativescript Angular UI Control for rendering a tabbed view with multiple
configurable options

## Setup

`npm install nativescript-ngx-tabview --save`

Import the module into your _app-module_

```
import { TabViewModule } from 'nativescript-ngx-tabview';

```

## Getting Started

Define the TabView template as shown in the example below

```
<TabView (tabChange)="watchTabChange($event)">
  <TabStrip position="left" overlay justifyContent="space-between">
    <TabLabel>
      <!-- Define the Tab Label here -->
    </TabLabel>
    <TabLabel>
      <!-- Define the Tab Label here -->
    </TabLabel>
    <TabLabel>
      <!-- Define the Tab Label here -->
    </TabLabel>
  </TabStrip>
  <TabGroup>
    <Tab>
      <!-- Insert Tab Content here -->
    </Tab>
    <Tab>
      <!-- Insert Tab Content here -->
    </Tab>
    <Tab>
      <!-- Insert Tab Content here -->
    </Tab>
  </TabGroup>
</TabView>

```

## Configuration

The __TabStrip__ allows for two main configuration settings:

- position [top/left/bottom/right]
- overlay 

The **overlay** setting will overlay the tab strip on the Tab View, by default the Tab Strip and
Tab Content would appear in separate rows.

The __tabChange()__ event will emit the index on Tab Switch

| The TabStrip is a FlexboxLayout so all related styles can be applied

# Examples

Provided in the demo app


