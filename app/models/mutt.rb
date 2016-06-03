class Mutt < ActiveRecord::Base
  belongs_to :owner, class_name: :user
  has_many :guesses, foreign_key: :mutt_id
  has_many :photos, foreign_key: :mutt_id

  # def what
    # breed_matcher = {}
    # self.breeds.each do |breed|
    #   if breed_matcher.keys.include? breed.name
    #     breed_matcher[breed.name] += breed.value
    #   else
    #     breed_matcher[breed.name] = breed.value
    #   end
    # end
    # return breed_matcher.sort_by{|key, value| value}.reverse.first(5)
  # end
end