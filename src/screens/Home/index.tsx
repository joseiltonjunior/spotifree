import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useSelector } from 'react-redux'

import { ReduxProps } from '@storage/index'

import { BottomMenu } from '@components/BottomMenu/Index'
import { ControlCurrentMusic } from '@components/ControlCurrentMusic'

import AnimatedLottieView from 'lottie-react-native'

import notFiles from '@assets/not-files.json'

import IconAnt from 'react-native-vector-icons/AntDesign'

import { useSideMenu } from '@hooks/useSideMenu'

import { ConfigProps } from '@storage/modules/config/reducer'
import { BoxCarousel } from '@components/BoxCarousel'

import { CurrentMusicProps } from '@storage/modules/currentMusic/reducer'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProps } from '@routes/routes'

import { RoundedCarousel } from '@components/RoundedCarousel'
import { UserProps } from '@storage/modules/user/reducer'
import { useLocalMusic } from '@hooks/useLocalMusic'
import { Button } from '@components/Button'
import { Section } from '@components/Section'

import { TrackListRemoteProps } from '@storage/modules/trackListRemote/reducer'
import { ArtistsProps } from '@storage/modules/artists/reducer'
import { MusicalGenresProps } from '@storage/modules/musicalGenres/reducer'
import { MusicalGenres } from '@components/MusicalGenres'
import { useEffect } from 'react'
import { useTrackPlayer } from '@hooks/useTrackPlayer'

export function Home() {
  const navigation = useNavigation<StackNavigationProps>()

  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const { handleStoragePermission } = useLocalMusic()

  const { user } = useSelector<ReduxProps, UserProps>((state) => state.user)

  const { isCurrentMusic } = useSelector<ReduxProps, CurrentMusicProps>(
    (state) => state.currentMusic,
  )

  const { getCurrentMusic } = useTrackPlayer()

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const { config } = useSelector<ReduxProps, ConfigProps>(
    (state) => state.config,
  )

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const { handleIsVisible } = useSideMenu()

  useEffect(() => {
    if (isCurrentMusic?.id) {
      getCurrentMusic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentMusic?.id])

  return (
    <>
      <ScrollView className="flex-1 bg-gray-950">
        <View className="p-4 flex-row items-center justify-between">
          <Text className="text-white text-3xl font-nunito-bold">Início</Text>

          <TouchableOpacity onPress={handleIsVisible} activeOpacity={0.6}>
            <IconAnt name="setting" size={26} />
          </TouchableOpacity>
        </View>

        {user.plain === 'premium' && (
          <View className="pl-4">
            {musicalGenres && (
              <Section title="Explore por gêneros musicais">
                <MusicalGenres musicalGenres={musicalGenres} />
              </Section>
            )}

            {trackListRemote && (
              <Section
                title="Explore novas possibilidades"
                className="mt-12"
                onPress={() =>
                  navigation.navigate('MoreMusic', {
                    listMusics: trackListRemote,
                    title: 'Explore novas possibilidades',
                  })
                }
              >
                <BoxCarousel musics={trackListRemote} />
              </Section>
            )}

            {artists && (
              <Section
                title="Explore por artistas"
                className="mt-12"
                onPress={() =>
                  navigation.navigate('MoreArtists', {
                    listArtists: artists,
                  })
                }
              >
                <RoundedCarousel artists={artists} />
              </Section>
            )}
          </View>
        )}

        {user.plain === 'free' && !config.isLocal && (
          <View className="p-4 items-center justify-center">
            <AnimatedLottieView
              source={notFiles}
              autoPlay
              loop
              resizeMode="contain"
              style={{ width: 300, height: 300 }}
            />
            <Text className="text-center text-xl text-white mt-8">
              Permita o acesso às suas músicas locais e desfrute dos serviços
              gratuitos.
            </Text>

            <Button
              title="PERMITIR ACESSO"
              onPress={handleStoragePermission}
              className="mt-8 w-full"
            />
          </View>
        )}
      </ScrollView>
      {isCurrentMusic && <ControlCurrentMusic music={isCurrentMusic} />}
      <BottomMenu />
    </>
  )
}
