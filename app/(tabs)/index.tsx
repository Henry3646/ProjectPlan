import { SafeAreaView, View } from 'react-native'
import React, { useEffect } from 'react'
import { useApp } from '~/context/AppContext';
import { Text } from '~/components/ui/text';

// interface Project {
//   id: string;
//   name: string;
//   description?: string;
//   steps: Step[];
//   createdAt: Date;
//   isPublished?: boolean;
// }

// export interface Step {
//   id: string;
//   imageUri: string;
//   comment?: string;
//   createdAt: Date;
// }

const index = () => {
  const { projects } = useApp();

  return (
    <SafeAreaView>
      <Text>index</Text>
    </SafeAreaView>
  )
}

export default index