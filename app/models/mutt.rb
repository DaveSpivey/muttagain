class Mutt < ActiveRecord::Base
  belongs_to :owner, class_name: "User"
  has_many :guesses, foreign_key: :mutt_id, dependent: :destroy
  has_many :photos, foreign_key: :mutt_id, dependent: :destroy

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