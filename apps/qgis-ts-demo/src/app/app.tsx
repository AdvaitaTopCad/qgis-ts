import styled from '@emotion/styled';

import { QgisMap } from '@qgis-ts/ui-emotion';

const StyledApp = styled.div`
    // Your style here
`;

export function App() {
    return (
        <StyledApp>
            <QgisMap
                initialView={{
                    center: [0, 0],
                    zoom: 1,
                }}
            />
        </StyledApp>
    );
}

export default App;
