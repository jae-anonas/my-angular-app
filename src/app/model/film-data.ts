export class FilmData {
  constructor(
    public film_id: number,
    public title: string,
    public description: string,
    public release_year: number,
    public language_id: number,
    public original_language_id: any,
    public rental_duration: number,
    public rental_rate: string,
    public length: number,
    public replacement_cost: string,
    public rating: string,
    public special_features: string,
    public last_update: string,
    public category_id: number,
    public category_name: string
  ) {}
}

export class FilmDataResponse {
  constructor(
    public page: number,
    public pageSize: string,
    public films: FilmData[],
    public total: number // total number of films for pagination
  ) {}
}

export class FilmDataByCategoryResponse {
  constructor(
    public category: string,
    public films: FilmData[]
  ) {}
}