class Thing < ActiveRecord::Base
  include Protectable
  validates :name, :presence=>true

  has_many :thing_images, inverse_of: :thing, dependent: :destroy
	has_many :service_offerings, inverse_of: :thing, dependent: :destroy
  scope :not_linked, ->(image) { where.not(:id=>ThingImage.select(:thing_id)
                                                          .where(:image=>image)) }
	scope :not_linked_se, ->(service_off) { where.not(id: service_off.select(:thing_id)) }
end
