import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useApp } from '~/context/AppContext';

const index = () => {
  const { projects } = useApp();
  
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index