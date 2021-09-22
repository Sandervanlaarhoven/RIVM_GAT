import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux'

import { RootState } from '../../redux/store';
import Header from './Header';
import SideBar from '../SideBar';
import CollectionWatches from './CollectionWatches/index';


interface IProps { }

const Framework: React.FC<IProps> = ({ children }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const menu = useSelector((state: RootState) => state.menu.open)

	return <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%" >
    <Header/>
    <CollectionWatches/>
    <Box
      display="flex"
      width="100%"
      flexDirection="row"
      justifyContent="flex-start"
      flexGrow={1}
      p={2}
    >
      <Box
        display={(desktop || menu) ? 'flex' : 'none'}
        flexDirection="column"
        borderRight={!desktop ? 'none' : '1px solid grey'}
        alignItems="flex-start"
        justifyContent="flex-start"
        p={2}
        flexGrow={0}
      >
        <SideBar />
      </Box>
      <Box
        display={desktop || !menu ? 'flex' : 'none'}
        p={2}
        flexDirection="column"
        flexGrow={1}
      >
        {children}
      </Box>
		</Box>
	</Box>
}

export default Framework
