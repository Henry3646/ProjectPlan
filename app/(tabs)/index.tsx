import { SafeAreaView, View } from 'react-native'
import React, { useEffect } from 'react'
import { useApp } from '~/context/AppContext';
import { Text } from '~/components/ui/text';

const index = () => {
  const { projects } = useApp();
  console.log('projects', projects)

  return (
    <SafeAreaView>
      <Text>index</Text>
    </SafeAreaView>
  )
}

export default index