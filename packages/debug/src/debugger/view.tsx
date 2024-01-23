import { useQgisMapContext } from '@qgis-ts/react';
import { JsonViewer, defineDataType } from '@textea/json-viewer';

// Subscribe form to values.
const config = {
    values: true,
};

// The style of the viewer.
const formStyle = {
    padding: '4px',
    margin: '4px',
    border: '1px solid blue',
    color: 'blue',
    backgroundColor: '#DDDDAA',
};

// Custom function type.
const functionDataType = defineDataType({
    is: (value) => typeof value === 'function',
    Component: (props) => <span style={{ color: 'red' }}>function</span>,
})

// Custom symbol type.
const symbolDataType = defineDataType({
    is: (value) => typeof value === 'symbol',
    Component: (props) => <span style={{ color: 'blue' }}>Symbol</span>,
})

// Collapse the form member.
const isExpanded = (path: (string | number)[], currentValue: any) => (
    !(path[0] === "intl" && path.length === 1)
)


/**
 * Present the content of the form.
 */
export function MapDebugger() {
    const data = useQgisMapContext();
    return (
        <div style={formStyle}>
            <JsonViewer
                rootName="Map State"
                value={data}
                valueTypes={[functionDataType, symbolDataType]}
                defaultInspectControl={isExpanded}
            />
        </div>
    );
}
