Breed.destroy_all

# Get list of breeds from Petfinder API
petfinder = Petfinder::Client.new(ENV['PET_KEY'], ENV['PET_SECRET'])
breeds = petfinder.breeds("dog")

# If wikipedia info for specific breed exists, get stock image
def getStockImage(link)
  dog_page = HTTParty.get(link, :verify => false)
  parsed_dog_page = Nokogiri::HTML(dog_page)

  info_table = parsed_dog_page.css(".biota")[0]
  
  image = info_table.css("img")[0]
  pic = image != nil ? "https:#{image['src']}" : nil
end

# Scrape wikipedia for matching breeds
dog_index_page = HTTParty.get('https://en.wikipedia.org/wiki/List_of_dog_breeds_recognized_by_the_American_Kennel_Club', :verify => false)
parsed_dog_index_page = Nokogiri::HTML(dog_index_page)

wikiDogs = {}
parsed_dog_index_page.css("#mw-content-text ul").each do |group|
  group.css('li a').each do |dog|

    if breeds.include? dog.text
      link = "https://en.wikipedia.org#{dog['href']}"
      wikiDogs[dog.text] = { link: link, pic: getStockImage(link) }
	end
  end
end

# Create Breed resources from Petfinder breeds, and include link and pic from wikipedia, if they exist
breeds.each do |breed|
  scraped_dog_info = wikiDogs[breed]
  link = scraped_dog_info != nil ? scraped_dog_info[:link] : ""
  pic = scraped_dog_info != nil ? scraped_dog_info[:pic] : ""

  # special link for my pits, not represented
  if breed == "Pit Bull Terrier"
  	link = "https://en.wikipedia.org/wiki/Pit_bull"
  	pic = getStockImage(link)
  end

  if breed == "Newfoundland Dog"
  	link = "https://en.wikipedia.org/wiki/Newfoundland_dog"
  	pic = getStockImage(link)
  end

  if breed == "Saint Bernard / St. Bernard"
  	link = "https://en.wikipedia.org/wiki/St._Bernard_(dog)"
  	pic = getStockImage(link)
  end

  p "*************  " + breed + "  *************"
  Breed.create(name: breed, link: link, pic: pic)
end
