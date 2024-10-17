'use client';

import { useQuery } from '@apollo/client';
import CharacterBlock from '@/components/Character';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'next/navigation'
import { Grid, GridItem, VStack } from '@chakra-ui/react'

import { gql } from '@/__generated__/gql';
import { Character } from '@/types';
import { useContext } from 'react';
import { UserProfileContext } from '@/components/UserProfile';

const getCharactersQuery = gql(`
    query getCharacters($page: Int!) {
    characters(page: $page) {
      info {
        pages
        count
      }
      results {
        id
        image
        name
        status
        species
        gender
        image
        location {
          name
        }
      }
    }
  }`)

const Page = () => {
  const { hasUser } = useContext(UserProfileContext);
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 1
  const { data } = useQuery(getCharactersQuery, { variables: { page: Number(page) }, skip: !hasUser });

  return <main>
    <VStack gap="4">
      {data?.characters?.info?.pages && <Pagination
        currentPage={Number(page)}
        pageCount={Number(data?.characters?.info?.pages)}
      />}
      <Grid templateColumns={['1', '1', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']} gap={[2, 6]}>
        {data?.characters?.results?.map((character) =>
          character && <GridItem key={character.id}>
            <CharacterBlock character={character as Character} />
          </GridItem>)}
      </Grid>
    </VStack>
  </main>

}

export default Page;