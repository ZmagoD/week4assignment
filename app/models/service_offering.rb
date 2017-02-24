class ServiceOffering < ActiveRecord::Base
  belongs_to :thing

  validates :name, presence: true
  validates :description, length: { maximum: 500 }
  scope :of_thing, ->(thing_id) { where('thing_id=?', thing_id)}
end
