page = HTTParty.get('https://en.wikipedia.org/wiki/List_of_dog_breeds_recognized_by_the_American_Kennel_Club', :verify => false)

parse_page = Nokogiri::HTML(page)

dogs = {}
parse_page.css("#mw-content-text > ul").each do |group|
  group.css('li a').each do |dog|
    break if dog.text == "List of dog breeds"
    break if dog['rel'] == "nofollow"
    dogs[dog.text] = dog['href']
  end
end

dogs.each do |breed, href|
  Breed.create(name: breed, link: "https://en.wikipedia.org#{href}")
end
