class ServiceOfferingsController < ApplicationController
  before_action :set_thing, only: :create
  before_action :set_service_offering, except: [:index, :create]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

	def index
		authorize @thing, :get_images?
		@service_offerings = ServiceOffering.of_thing(params.fetch(:thing_id))
	end

	def create
		service = ServiceOffering.new(service_offering_params)
		if service.save
			@thing.service_offerings << service
		end
	end

	def update
		@service_offering.update_attributes(service_offering_params)
	end

	def destroy
		@service_offering.destroy
	end

	private

	def set_thing
		@thing = Thing.find_by_id(params[:thing_id])
	end

	def set_service_offering
		@service_offering = ServiceOffering.find_by_id(params[:id])
	end

	def service_offering_params
		params.require(:service_offering).tap {|p|
			p.require(:name) #throws ActionController::ParameterMissing
		}.permit(:name, :description)
	end
end